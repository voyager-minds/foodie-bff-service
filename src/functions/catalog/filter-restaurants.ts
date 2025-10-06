import axios from 'axios';
import middy from '@middy/core';
import { formatJSONResponse, badRequest, serverError } from '../../libs/api-gateway';
import { APIGatewayEvent } from 'aws-lambda';

const CATALOG_BASE_URL = process.env.CATALOG_API_URL;

const handler = async (event: APIGatewayEvent) => {
    try {
        const qs = event.queryStringParameters || {};
        const city = (qs.city || '').trim();
        const category = (qs.category || '').trim();
        const page = qs.page || '1';
        console.info('[filter-restaurants] Incoming request', { city, category, page });
        if (!city && !category) {
            console.warn('[filter-restaurants] Missing city and category');
            return badRequest('At least one of city or category is required');
        }

        const url = `${CATALOG_BASE_URL}/restaurants/filter`;
        const params = { city, category, page };
        console.info('[filter-restaurants] Forwarding request', { url, params });
        const response = await axios.get(url, { params });
        console.info('[filter-restaurants] Received response', { status: response.status });
        return formatJSONResponse(response.data);
    } catch (e) {
        console.error('[filter-restaurants] Error', e);
        return serverError(e);
    }
};

export const main = middy(handler);
