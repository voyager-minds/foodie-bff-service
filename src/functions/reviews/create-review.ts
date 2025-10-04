import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';

const REVIEWS_API_URL = process.env.REVIEWS_API_URL;

const createReview = async (event: APIGatewayEvent) => {
  const url = `${REVIEWS_API_URL}/reviews`;
  console.info(`[createReview] POST ${url}`);
  try {
    const response = await axios.post(url, event.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    console.info(`[createReview] Success: status ${response.status}`);
    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: { 'Content-Type': response.headers['content-type'] || 'application/json' },
    };
  } catch (error) {
    console.error(`[createReview] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const main = middyfy(createReview);
