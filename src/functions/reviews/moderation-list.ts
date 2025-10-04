import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';

const REVIEWS_API_URL = process.env.REVIEWS_API_URL;

const listModeration = async (event: APIGatewayEvent) => {
  const qs = event.queryStringParameters || {};
  const params = new URLSearchParams(qs as Record<string, string>).toString();
  const url = `${REVIEWS_API_URL}/admin/moderation${params ? `?${params}` : ''}`;
  console.info(`[listModeration] GET ${url}`);
  try {
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    console.info(`[listModeration] Success: status ${response.status}`);
    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: { 'Content-Type': response.headers['content-type'] || 'application/json' },
    };
  } catch (error) {
    console.error(`[listModeration] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const main = middyfy(listModeration);
