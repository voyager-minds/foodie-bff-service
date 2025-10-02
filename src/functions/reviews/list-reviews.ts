import {middyfy} from '@libs/lambda';
import {db} from '@libs/database-manager';
import {formatJSONResponse, badRequest, serverError} from '@libs/api-gateway';
import {APIGatewayEvent} from 'aws-lambda';

const handler = async (event: APIGatewayEvent) => {
  try {
    const qs = event.queryStringParameters || {};
    const restaurantId = qs.restaurantId?.trim();
    const menuItemId = qs.itemId?.trim();
    const page = Math.max(parseInt(qs.page || '1', 10) || 1, 1);
    const limit = 20;
    const offset = (page - 1) * limit;

    if (!restaurantId && !menuItemId) {
      return badRequest('restaurantId or itemId is required');
    }

    const where: string[] = [`status = 'APPROVED'`];
    const params: any[] = [];
    let i = 1;

    if (restaurantId) {
      where.push(`restaurant_id = $${i}`);
      params.push(restaurantId);
      i++;
    }
    if (menuItemId) {
      where.push(`menu_item_id = $${i}`);
      params.push(menuItemId);
      i++;
    }

    const sql = `
      SELECT id, restaurant_id AS "restaurantId", menu_item_id AS "menuItemId",
             author_sub AS "authorSub", ratings, text, status,
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM review.reviews
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const {rows} = await db.query(sql, params);
    return formatJSONResponse({page, items: rows});
  } catch (e) {
    return serverError(e);
  }
};
export const main = middyfy(handler);
