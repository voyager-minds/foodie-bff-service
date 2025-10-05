import {middyfy} from '@libs/lambda';
import {APIGatewayEvent} from 'aws-lambda';
import axios from 'axios';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

const getRestaurant = async (event: APIGatewayEvent) => {
  const restaurantId = event.pathParameters?.id;
  const url = `${CATALOG_API_URL}/restaurants/${restaurantId}`;
  console.info(`[getRestaurant] GET ${url}`);

  const response = await axios
    .get(url)
    .then((response) => {
      console.info(response.data);
      return {
        statusCode: response?.status,
        body: typeof response?.data === 'string' ? response?.data : JSON.stringify(response?.data),
        headers: {'Content-Type': response?.headers['content-type'] || 'application/json'},
      };
    })
    .catch((error) => {
      console.error(error);
      console.error('[getRestaurant] Axios error', {
        message: error?.message,
        code: error?.code,
        errno: error?.errno,
        syscall: error?.syscall,
        responseStatus: error?.response?.status,
        responseData: error?.response?.data,
      });
      return {
        statusCode: 500,
        body: JSON.stringify({message: error?.response?.data}),
      };
    });
  return response;
};

export const main = getRestaurant;
