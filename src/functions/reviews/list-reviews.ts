import {middyfy} from '@libs/lambda';
import {APIGatewayEvent} from 'aws-lambda';
import axios from 'axios';

const REVIEWS_API_URL = process.env.REVIEWS_API_URL;

const listReviews = async (event: APIGatewayEvent) => {
  const qs = event.queryStringParameters || {};
  const params = new URLSearchParams(qs as Record<string, string>).toString();
  const url = `${REVIEWS_API_URL}/reviews${params ? `?${params}` : ''}`;
  console.info(`[listReviews] GET ${url}`);
  try {
    const response = await axios.get(url, {
      validateStatus: () => true,
    });
    console.info(`[listReviews] Success: status ${response.status}`);
    console.debug(`[listReviews] Response data:`, response.data);

    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: {'Content-Type': response.headers['content-type'] || 'application/json'},
    };
  } catch (error) {
    console.error(`[listReviews] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({message: 'Internal server error'}),
    };
  }
};

export const main = middyfy(listReviews);
