import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from 'aws-lambda';
import type {FromSchema} from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {body: FromSchema<S>};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const formatJSONResponse = (response: unknown, statusCode = 200): APIGatewayProxyResult => ({
  statusCode,
  headers: {'content-type': 'application/json'},
  body: JSON.stringify(response),
});

export const badRequest = (message = 'Bad Request') => formatJSONResponse({error: message}, 400);
export const notFound = (message = 'Not Found') => formatJSONResponse({error: message}, 404);
export const created = (payload: unknown) => formatJSONResponse(payload, 201);
export const serverError = (e: unknown) => formatJSONResponse({error: 'Internal Server Error', detail: (e as Error)?.message}, 500);
