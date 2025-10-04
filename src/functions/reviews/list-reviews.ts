import { middyfy } from '@libs/lambda';
import fetch from 'node-fetch';

const REVIEWS_API_URL = process.env.REVIEWS_API_URL;

const listReviews = async (event) => {
  const qs = event.queryStringParameters || {};
  const params = new URLSearchParams(qs as Record<string, string>).toString();
  const url = `${REVIEWS_API_URL}/reviews${params ? `?${params}` : ''}`;
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

export const main = middyfy(listReviews);
