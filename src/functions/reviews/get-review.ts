import {middyfy} from '@libs/lambda';
import {db} from '@libs/database-manager';
import {formatJSONResponse, notFound, serverError} from '@libs/api-gateway';
import {APIGatewayEvent} from 'aws-lambda';

const handler = async (event: APIGatewayEvent) => {
  try {
    const id = event.pathParameters?.id!;
    const {rows} = await db.query(
      `SELECT id, restaurant_id AS "restaurantId", menu_item_id AS "menuItemId",
              author_sub AS "authorSub", ratings, text, status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM review.reviews
       WHERE id = $1 AND status = 'APPROVED'`,
      [id]
    );
    if (!rows.length) return notFound('Review not found or not approved');
    return formatJSONResponse(rows[0]);
  } catch (e) {
    return serverError(e);
  }
};
export const main = middyfy(handler);
