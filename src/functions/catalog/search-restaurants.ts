import axios from 'axios';
import middy from '@middy/core';
import { formatJSONResponse, badRequest, serverError } from '../../libs/api-gateway';
import { APIGatewayEvent } from 'aws-lambda';

const CATALOG_BASE_URL = process.env.CATALOG_API_URL;

const handler = async (event: APIGatewayEvent) => {
  try {
    const qs = event.queryStringParameters || {};
    const query = (qs.query || '').trim();
    const page = qs.page || '1';
    if (!query) return badRequest('Search query is required');

    const url = `${CATALOG_BASE_URL}/restaurants/search`;
    const params = { query, page };
    const response = await axios.get(url, { params });
    return formatJSONResponse(response.data);
  } catch (e) {
    return serverError(e);
  }
};

export const main = middy(handler);
