import {randomUUID} from 'crypto';
import {middyfy} from '@libs/lambda';
import {db} from '@libs/database-manager';
import {CommentCreateDTO} from '../../entities/review.entities';
import {created, badRequest, notFound, serverError} from '@libs/api-gateway';
import {APIGatewayEvent} from 'aws-lambda';

const handler = async (event: APIGatewayEvent) => {
  try {
    const reviewId = event.pathParameters?.id!;
    const exists = await db.one<{exists: number}>(`SELECT 1 as exists FROM review.reviews WHERE id=$1`, [reviewId]);
    if (!exists) return notFound('Review not found');

    const parsed = CommentCreateDTO.safeParse(event.body);
    if (!parsed.success) return badRequest(parsed.error.issues.map((i) => i.message).join(', '));

    const id = randomUUID();
    const {authorSub, role, text} = parsed.data;

    await db.query(
      `INSERT INTO review.comments (id, review_id, author_sub, role, text, status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING')`,
      [id, reviewId, authorSub, role, text]
    );

    return created({id, status: 'PENDING'});
  } catch (e) {
    return serverError(e);
  }
};
export const main = middyfy(handler);
