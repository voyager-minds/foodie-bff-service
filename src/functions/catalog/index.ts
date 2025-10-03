import {handlerPath} from '@libs/handler-resolver';

export const getRestaurants = {
  handler: `${handlerPath(__dirname)}/list-restaurants.main`,
  events: [{httpApi: {method: 'get', path: '/restaurants'}}],
};

export const getRestaurantById = {
  handler: `${handlerPath(__dirname)}/get-restaurant.main`,
  events: [{httpApi: {method: 'get', path: '/restaurants/{id}'}}],
};

export const getMenuForRestaurant = {
  handler: `${handlerPath(__dirname)}/get-menu.main`,
  events: [{httpApi: {method: 'get', path: '/restaurants/{id}/menu'}}],
};

export const adminCreateRestaurant = {
  handler: `${handlerPath(__dirname)}/admin-create-restaurant.main`,
  events: [{httpApi: {method: 'post', path: '/admin/restaurants'}}],
  // TODO: attach authorizer later
};

export const adminAddMenuItem = {
  handler: `${handlerPath(__dirname)}/admin-add-menu-item.main`,
  events: [{httpApi: {method: 'post', path: '/admin/restaurants/{id}/menu-items'}}],
};

export const presignUpload = {
  handler: `${handlerPath(__dirname)}/presign-upload.main`,
  events: [{httpApi: {method: 'post', path: '/admin/uploads/presign'}}],
};
