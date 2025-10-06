import axios from 'axios';
import middy from '@middy/core';
import { formatJSONResponse, badRequest, notFound, serverError } from '../../libs/api-gateway';
import { APIGatewayEvent } from 'aws-lambda';

const CATALOG_BASE_URL = process.env.CATALOG_API_URL;

const handler = async (event: APIGatewayEvent) => {
  try {
    const menuItemId = event.pathParameters?.id;
    if (!menuItemId) return badRequest('Menu item id is required');
    const url = `${CATALOG_BASE_URL}/admin/menu-items/${menuItemId}`;
    const response = await axios.delete(url);
    if (response.status === 404) return notFound('Menu item not found');
    return formatJSONResponse(response.data);
  } catch (e) {
    return serverError(e);
  }
};

export const main = middy(handler);
