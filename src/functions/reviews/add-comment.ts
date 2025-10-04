import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';

const REVIEWS_API_URL = process.env.REVIEWS_API_URL;

const addComment = async (event: APIGatewayEvent) => {
  const reviewId = event.pathParameters?.id;
  const url = `${REVIEWS_API_URL}/reviews/${reviewId}/comments`;
  console.info(`[addComment] POST ${url}`);
  try {
    const response = await axios.post(url, event.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    console.info(`[addComment] Success: status ${response.status}`);
    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: { 'Content-Type': response.headers['content-type'] || 'application/json' },
    };
  } catch (error) {
    console.error(`[addComment] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const main = middyfy(addComment);
