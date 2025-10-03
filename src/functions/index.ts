import { adminAddMenuItem, adminCreateRestaurant, getMenuForRestaurant, getRestaurantById, getRestaurants, presignUpload } from './catalog';

const functions = {
    getRestaurantById,
    presignUpload,
    adminAddMenuItem,
    adminCreateRestaurant,
    getMenuForRestaurant,
    getRestaurants
};

export default functions;