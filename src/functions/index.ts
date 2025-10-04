import { addComment, createReview, getReview, listReviews, moderationApprove, moderationList, moderationReject } from './../../../reviews-service/src/functions/reviews/index';
import { adminAddMenuItem, adminCreateRestaurant, getMenuForRestaurant, getRestaurantById, getRestaurants, presignUpload } from './catalog';

const functions = {
    createReview,
    addComment,
    getReview,
    listReviews,
    moderationList,
    moderationApprove,
    moderationReject,
    getRestaurantById,
    presignUpload,
    adminAddMenuItem,
    adminCreateRestaurant,
    getMenuForRestaurant,
    getRestaurants
};

export default functions;