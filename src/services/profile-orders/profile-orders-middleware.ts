import { WS_URL } from '@utils/constants';

import { createSocketMiddleware } from '../socket-middleware';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersConnected,
  profileOrdersConnecting,
  profileOrdersDisconnected,
  profileOrdersError,
  profileOrdersMessageReceived,
} from './profile-orders-slice';

import type { TOrdersResponse } from '@utils/types';

export const profileOrdersMiddleware = createSocketMiddleware<TOrdersResponse>(
  {
    connect: connectProfileOrders,
    disconnect: disconnectProfileOrders,
    connecting: profileOrdersConnecting,
    connected: profileOrdersConnected,
    disconnected: profileOrdersDisconnected,
    messageReceived: profileOrdersMessageReceived,
    error: profileOrdersError,
  },
  {
    url: WS_URL,
    withToken: true,
  }
);
