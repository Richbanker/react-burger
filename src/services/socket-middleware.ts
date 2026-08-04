import { getAccessToken, refreshTokenApi } from '@utils/api';

import type {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Middleware,
} from '@reduxjs/toolkit';

type TSocketActions<TMessage> = {
  connect: ActionCreatorWithoutPayload;
  disconnect: ActionCreatorWithoutPayload;
  connecting: ActionCreatorWithoutPayload;
  connected: ActionCreatorWithoutPayload;
  disconnected: ActionCreatorWithoutPayload;
  messageReceived: ActionCreatorWithPayload<TMessage>;
  error: ActionCreatorWithPayload<string>;
};

type TSocketOptions = {
  url: string;
  withToken?: boolean;
};

const RECONNECT_DELAY = 3000;
const TOKEN_ERROR_PATTERN = /token|jwt/i;

export const createSocketMiddleware = <
  TMessage extends { success: boolean; message?: string },
>(
  actions: TSocketActions<TMessage>,
  options: TSocketOptions
): Middleware => {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let shouldReconnect = false;
  let isRefreshingToken = false;

  return (store) => (next) => (action) => {
    const result = next(action);

    const clearReconnectTimer = (): void => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const getSocketUrl = (): string | null => {
      if (!options.withToken) {
        return options.url;
      }

      const accessToken = getAccessToken()?.replace('Bearer ', '');
      return accessToken ? `${options.url}?token=${accessToken}` : null;
    };

    const connect = (): void => {
      clearReconnectTimer();

      if (
        socket &&
        (socket.readyState === WebSocket.CONNECTING ||
          socket.readyState === WebSocket.OPEN)
      ) {
        return;
      }

      const socketUrl = getSocketUrl();

      if (!socketUrl) {
        store.dispatch(actions.error('Не удалось получить токен доступа'));
        return;
      }

      store.dispatch(actions.connecting());
      const currentSocket = new WebSocket(socketUrl);
      socket = currentSocket;

      currentSocket.onopen = (): void => {
        store.dispatch(actions.connected());
      };

      currentSocket.onerror = (): void => {
        store.dispatch(actions.error('Ошибка WebSocket-соединения'));
      };

      currentSocket.onmessage = (event: MessageEvent<string>): void => {
        try {
          const data = JSON.parse(event.data) as TMessage;

          if (
            !data.success &&
            options.withToken &&
            TOKEN_ERROR_PATTERN.test(data.message ?? '')
          ) {
            if (!isRefreshingToken) {
              isRefreshingToken = true;
              void refreshTokenApi()
                .then((tokens) => {
                  localStorage.setItem('accessToken', tokens.accessToken);
                  localStorage.setItem('refreshToken', tokens.refreshToken);
                  socket?.close();
                  connect();
                })
                .catch((error: unknown) => {
                  const message =
                    error instanceof Error
                      ? error.message
                      : 'Не удалось обновить токен доступа';
                  store.dispatch(actions.error(message));
                })
                .finally(() => {
                  isRefreshingToken = false;
                });
            }

            return;
          }

          store.dispatch(actions.messageReceived(data));
        } catch {
          store.dispatch(actions.error('Сервер вернул некорректные данные'));
        }
      };

      currentSocket.onclose = (): void => {
        if (socket !== currentSocket) {
          return;
        }

        socket = null;
        store.dispatch(actions.disconnected());

        if (shouldReconnect && !isRefreshingToken) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
        }
      };
    };

    if (actions.connect.match(action)) {
      shouldReconnect = true;
      connect();
    }

    if (actions.disconnect.match(action)) {
      shouldReconnect = false;
      clearReconnectTimer();
      socket?.close();
      socket = null;
    }

    return result;
  };
};
