import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersResponse } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isConnecting: false,
  isConnected: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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
        state.error = action.payload.message ?? 'Ошибка получения истории заказов';
        return;
      }

      state.orders = action.payload.orders;
      state.error = null;
    },
    error: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.error = action.payload;
    },
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersIsConnecting: (state) => state.isConnecting,
    selectProfileOrdersIsConnected: (state) => state.isConnected,
    selectProfileOrdersError: (state) => state.error,
  },
});

export const {
  connect: connectProfileOrders,
  disconnect: disconnectProfileOrders,
  connecting: profileOrdersConnecting,
  connected: profileOrdersConnected,
  disconnected: profileOrdersDisconnected,
  messageReceived: profileOrdersMessageReceived,
  error: profileOrdersError,
} = profileOrdersSlice.actions;

export const {
  selectProfileOrders,
  selectProfileOrdersIsConnecting,
  selectProfileOrdersIsConnected,
  selectProfileOrdersError,
} = profileOrdersSlice.selectors;
