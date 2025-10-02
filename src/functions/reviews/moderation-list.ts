import {middyfy} from '@libs/lambda';
import {db} from '@libs/database-manager';
import {formatJSONResponse, serverError} from '@libs/api-gateway';

const handler = async () => {
  try {
    // For simplicity show pending reviews only.
    const {rows} = await db.query(
      `SELECT id, restaurant_id AS "restaurantId", menu_item_id AS "menuItemId",
              author_sub AS "authorSub", ratings, text,
              created_at AS "createdAt"
       FROM review.reviews
       WHERE status = 'PENDING'
       ORDER BY created_at ASC
       LIMIT 200`
    );
    return formatJSONResponse(rows);
  } catch (e) {
    return serverError(e);
  }
};
export const main = middyfy(handler);
