import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

const listRestaurants = async (event: APIGatewayEvent) => {
  const qs = event.queryStringParameters || {};
  const params = new URLSearchParams(qs as Record<string, string>).toString();
  const url = `${CATALOG_API_URL}/restaurants${params ? `?${params}` : ''}`;
  console.info(`[listRestaurants] GET ${url}`);
  try {
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    console.info(`[listRestaurants] Success: status ${response.status}`);
    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: { 'Content-Type': response.headers['content-type'] || 'application/json' },
    };
  } catch (error) {
    console.error(`[listRestaurants] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const main = middyfy(listRestaurants);
