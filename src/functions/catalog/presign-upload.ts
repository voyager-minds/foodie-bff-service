import { middyfy } from '@libs/lambda';
import fetch from 'node-fetch';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

const presignUpload = async (event) => {
  const url = `${CATALOG_API_URL}/admin/uploads/presign`;
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

export const main = middyfy(presignUpload);
