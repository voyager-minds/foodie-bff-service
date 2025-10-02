import {randomUUID} from 'crypto';
import {middyfy} from '@libs/lambda';
import {db} from '@libs/database-manager';
import {ReviewCreateDTO} from '../../entities/review.entities';
import {created, badRequest, serverError} from '@libs/api-gateway';
import {APIGatewayEvent} from 'aws-lambda';

const handler = async (event: APIGatewayEvent) => {
  try {
    // http-json-body-parser made body an object
    const parsed = ReviewCreateDTO.safeParse(event.body);
    if (!parsed.success) return badRequest(parsed.error.issues.map((i) => i.message).join(', '));

    const id = randomUUID();
    const {restaurantId, menuItemId, ratings, text, authorSub} = parsed.data;

    await db.query(
      `INSERT INTO review.reviews (id, restaurant_id, menu_item_id, author_sub, ratings, text, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
      [id, restaurantId, menuItemId ?? null, authorSub, ratings, text]
    );

    return created({id, status: 'PENDING'});
  } catch (e) {
    return serverError(e);
  }
};
export const main = middyfy(handler);
