import { WS_URL } from '@utils/constants';

import { createSocketMiddleware } from '../socket-middleware';
import {
  connectFeed,
  disconnectFeed,
  feedConnected,
  feedConnecting,
  feedDisconnected,
  feedError,
  feedMessageReceived,
} from './feed-slice';

import type { TOrdersResponse } from '@utils/types';

export const feedMiddleware = createSocketMiddleware<TOrdersResponse>(
  {
    connect: connectFeed,
    disconnect: disconnectFeed,
    connecting: feedConnecting,
    connected: feedConnected,
    disconnected: feedDisconnected,
    messageReceived: feedMessageReceived,
    error: feedError,
  },
  {
    url: `${WS_URL}/all`,
  }
);
