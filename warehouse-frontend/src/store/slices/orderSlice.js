import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'order/fetchAll',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      return await orderService.getAll(page, size);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'order/create',
  async (data, { rejectWithValue }) => {
    try {
      return await orderService.create(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateStatus(id, status);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      // Update status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;