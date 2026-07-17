import { combineReducers } from '@reduxjs/toolkit';
import user from './slices/userSlice';
import ingredients from './slices/ingredientsSlice';
import feeds from './slices/feedsSlice';
import orders from './slices/ordersSlice';
import burgerConstructor from './slices/burgerConstructorSlice';

export const rootReducer = combineReducers({
  user,
  ingredients,
  feeds,
  orders,
  burgerConstructor
});
