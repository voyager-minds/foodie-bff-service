import { addComment, createReview, getReview, listReviews, moderationApprove, moderationList, moderationReject } from './reviews';
import { adminAddMenuItem, adminCreateRestaurant, deleteMenuItem, filterRestaurants, getMenuForRestaurant, getRestaurantById, getRestaurants, presignUpload, searchRestaurants, updateMenuItem } from './catalog';

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
    getRestaurants,
    searchRestaurants,
    filterRestaurants,
    updateMenuItem,
    deleteMenuItem
};

export default functions;