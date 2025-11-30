import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import warehouseService from '../../services/warehouseService';

// Async thunks
export const fetchWarehouses = createAsyncThunk(
  'warehouse/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await warehouseService.getAll();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createWarehouse = createAsyncThunk(
  'warehouse/create',
  async (data, { rejectWithValue }) => {
    try {
      return await warehouseService.create(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateWarehouse = createAsyncThunk(
  'warehouse/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await warehouseService.update(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteWarehouse = createAsyncThunk(
  'warehouse/delete',
  async (id, { rejectWithValue }) => {
    try {
      await warehouseService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState: {
    warehouses: [],
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
      // Fetch warehouses
      .addCase(fetchWarehouses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.warehouses = action.payload.content || [];;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create warehouse
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.warehouses.push(action.payload);
      })
      // Update warehouse
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        const index = state.warehouses.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.warehouses[index] = action.payload;
        }
      })
      // Delete warehouse
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.warehouses = state.warehouses.filter((w) => w.id !== action.payload);
      });
  },
});

export const { clearError } = warehouseSlice.actions;
export default warehouseSlice.reducer;