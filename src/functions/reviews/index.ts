import { handlerPath } from '@libs/handler-resolver';

export const createReview = {
  handler: `${handlerPath(__dirname)}/create-review.main`,
  events: [{ httpApi: { method: 'post', path: '/reviews' } }],
};

export const listReviews = {
  handler: `${handlerPath(__dirname)}/list-reviews.main`,
  events: [{ httpApi: { method: 'get', path: '/reviews' } }],
};

export const getReview = {
  handler: `${handlerPath(__dirname)}/get-review.main`,
  events: [{ httpApi: { method: 'get', path: '/reviews/{id}' } }],
};

export const addComment = {
  handler: `${handlerPath(__dirname)}/add-comment.main`,
  events: [{ httpApi: { method: 'post', path: '/reviews/{id}/comments' } }],
};

export const moderationList = {
  handler: `${handlerPath(__dirname)}/moderation-list.main`,
  events: [{ httpApi: { method: 'get', path: '/admin/moderation' } }],
};

export const moderationApprove = {
  handler: `${handlerPath(__dirname)}/moderation-approve.main`,
  events: [{ httpApi: { method: 'post', path: '/admin/moderation/{reviewId}/approve' } }],
};

export const moderationReject = {
  handler: `${handlerPath(__dirname)}/moderation-reject.main`,
  events: [{ httpApi: { method: 'post', path: '/admin/moderation/{reviewId}/reject' } }],
};
