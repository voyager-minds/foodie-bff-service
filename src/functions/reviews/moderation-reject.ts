import {middyfy} from '@libs/lambda';
import {db} from '@libs/database-manager';
import {ModerationDecisionDTO} from '../../entities/review.entities';
import {formatJSONResponse, badRequest, notFound, serverError} from '@libs/api-gateway';
import {recomputeRestaurantAggregates, recomputeItemAggregates} from '../_shared/aggregates';
import {APIGatewayEvent} from 'aws-lambda';

const handler = async (event: APIGatewayEvent) => {
  try {
    const reviewId = event.pathParameters?.reviewId!;
    const body = event.body ?? {};
    const parsed = ModerationDecisionDTO.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues.map((i) => i.message).join(', '));

    // Reject only if currently PENDING or APPROVED → REJECTED (then recompute)
    const {rows} = await db.query(
      `UPDATE review.reviews
       SET status = 'REJECTED'
       WHERE id = $1 AND status <> 'REJECTED'
       RETURNING restaurant_id AS "restaurantId", menu_item_id AS "menuItemId", status`,
      [reviewId]
    );
    if (!rows.length) return notFound('Review not found');

    const {restaurantId, menuItemId} = rows[0];

    // Recompute aggregates (in case it was APPROVED earlier)
    await recomputeRestaurantAggregates(restaurantId);
    if (menuItemId) await recomputeItemAggregates(menuItemId);

    return formatJSONResponse({reviewId, status: 'REJECTED'});
  } catch (e) {
    return serverError(e);
  }
};

export const main = middyfy(handler);
