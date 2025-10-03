import { middyfy } from '@libs/lambda';
import fetch from 'node-fetch';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

const listRestaurants = async (event) => {
  const qs = event.queryStringParameters || {};
  const params = new URLSearchParams(qs as Record<string, string>).toString();
  const url = `${CATALOG_API_URL}/restaurants${params ? `?${params}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await response.text();
  return {
    statusCode: response.status,
    body,
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
  };
};

export const main = middyfy(listRestaurants);
