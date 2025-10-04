import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

const adminCreateRestaurant = async (event: APIGatewayEvent) => {
  const url = `${CATALOG_API_URL}/admin/restaurants`;
  console.info(`[adminCreateRestaurant] POST ${url}`);
  try {
    const response = await axios.post(url, event.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    console.info(`[adminCreateRestaurant] Success: status ${response.status}`);
    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: { 'Content-Type': response.headers['content-type'] || 'application/json' },
    };
  } catch (error) {
    console.error(`[adminCreateRestaurant] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const main = middyfy(adminCreateRestaurant);
