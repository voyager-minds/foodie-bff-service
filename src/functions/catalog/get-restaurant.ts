import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import axios from 'axios';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

const getRestaurant = async (event: APIGatewayEvent) => {
  const restaurantId = event.pathParameters?.id;
  const url = `${CATALOG_API_URL}/restaurants/${restaurantId}`;
  console.info(`[getRestaurant] GET ${url}`);
  try {
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });
    console.info(`[getRestaurant] Success: status ${response.status}`);
    return {
      statusCode: response.status,
      body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data),
      headers: { 'Content-Type': response.headers['content-type'] || 'application/json' },
    };
  } catch (error) {
    console.error(`[getRestaurant] Error:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

export const main = middyfy(getRestaurant);
