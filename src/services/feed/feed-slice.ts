import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersResponse } from '@utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnecting: false,
  isConnected: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    connect: () => undefined,
    disconnect: () => undefined,
    connecting: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    connected: (state) => {
      state.isConnecting = false;
      state.isConnected = true;
      state.error = null;
    },
    disconnected: (state) => {
      state.isConnecting = false;
      state.isConnected = false;
    },
    messageReceived: (state, action: PayloadAction<TOrdersResponse>) => {
      if (!action.payload.success) {
        state.error = action.payload.message ?? 'Ошибка получения ленты заказов';
        return;
      }

      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
    },
    error: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.error = action.payload;
    },
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedIsConnecting: (state) => state.isConnecting,
    selectFeedIsConnected: (state) => state.isConnected,
    selectFeedError: (state) => state.error,
  },
});

export const {
  connect: connectFeed,
  disconnect: disconnectFeed,
  connecting: feedConnecting,
  connected: feedConnected,
  disconnected: feedDisconnected,
  messageReceived: feedMessageReceived,
  error: feedError,
} = feedSlice.actions;

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedIsConnecting,
  selectFeedIsConnected,
  selectFeedError,
} = feedSlice.selectors;
