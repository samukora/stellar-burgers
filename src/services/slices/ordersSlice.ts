import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';
import { clearConstructor } from './burgerConstructorSlice';

type TOrdersState = {
  orders: TOrder[];
  isOrdersLoading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrdersState = {
  orders: [],
  isOrdersLoading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const getOrderByNumber = createAsyncThunk(
  'orders/getByNumber',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(orderId);
      return data;
    } catch (err) {
      return rejectWithValue('Ошибка загрузки данных');
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (err) {
      return rejectWithValue('Ошибка загрузки данных');
    }
  }
);
export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredientsList: string[], { dispatch, rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientsList);
      dispatch(clearConstructor());
      return response.order as unknown as TOrder;
    } catch (err) {
      return rejectWithValue('Ошибка оформления заказа');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    closeOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.isOrdersLoading = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orderModalData = action.payload.orders[0];
      })
      .addCase(getOrders.pending, (state) => {
        state.error = null;
        state.isOrdersLoading = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.error = action.payload as string;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.orders = [action.payload, ...state.orders];
      });
  }
});

export default ordersSlice.reducer;
export const { selectOrderRequest, selectOrderModalData, selectOrders } =
  ordersSlice.selectors;
export const { closeOrderModalData } = ordersSlice.actions;
