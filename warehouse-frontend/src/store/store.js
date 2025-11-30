import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import warehouseReducer from './slices/warehouseSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    warehouse: warehouseReducer,
    product: productReducer,
    order: orderReducer,
  },
});