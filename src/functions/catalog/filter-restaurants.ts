import axios from 'axios';
import middy from '@middy/core';
import { formatJSONResponse, badRequest, serverError } from '../../libs/api-gateway';
import { APIGatewayEvent } from 'aws-lambda';

const CATALOG_BASE_URL = process.env.CATALOG_SERVICE_URL;

const handler = async (event: APIGatewayEvent) => {
  try {
    const qs = event.queryStringParameters || {};
    const city = (qs.city || '').trim();
    const category = (qs.category || '').trim();
    const page = qs.page || '1';
    if (!city && !category) return badRequest('At least one of city or category is required');

    const url = `${CATALOG_BASE_URL}/restaurants/filter`;
    const params = { city, category, page };
    const response = await axios.get(url, { params });
    return formatJSONResponse(response.data);
  } catch (e) {
    return serverError(e);
  }
};

export const main = middy(handler);
