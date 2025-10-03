import { middyfy } from '@libs/lambda';
import fetch from 'node-fetch';

const REVIEWS_API_URL = process.env.REVIEWS_API_URL;

const approveReview = async (event) => {
  const reviewId = event.pathParameters?.reviewId;
  const url = `${REVIEWS_API_URL}/admin/moderation/${reviewId}/approve`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: event.body,
  });
  const body = await response.text();
  return {
    statusCode: response.status,
    body,
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
  };
};

export const main = middyfy(approveReview);
