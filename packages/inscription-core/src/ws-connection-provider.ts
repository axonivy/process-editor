/**
 * Extensions to @axonivy/jsonrpc
 */

import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
  wrap,
  type Connection,
  type Logger,
  type WebSocketOptions
} from '@axonivy/jsonrpc';

export type WebSocketConnectionHandler<TConnection> = {
  onConnection: (connection: WebSocketConnection) => TConnection | Promise<TConnection>;
  onReconnect: (connection: WebSocketConnection, oldConnection: TConnection) => TConnection | Promise<TConnection>;
  onReconnecting?: (connection: WebSocketConnection, oldConnection?: TConnection) => void | Promise<void>;
  onClose?: (connection?: TConnection) => void | Promise<void>;
  logger?: Logger;
};

export interface WebSocketConnection extends Connection {
  reader: WebSocketMessageReader;
  writer: WebSocketMessageWriter;
}

const defaultOptions: Required<Omit<WebSocketOptions, 'abortSignal'>> = {
  reconnect: true,
  reconnectAttempts: Infinity,
  reconnectDelay: 1000,
  connectedMessage: 'Connection established!',
  reconnectedMessage: 'Reconnected!',
  errorMessage: 'Connection could not be established. Please make sure that the server is running!',
  reconnectingMessage: 'Trying to reconnect...',
  reconnectFailedMessage: 'Reconnection failed. Tried {attempts} times.',
  closeMessage: 'Connection was closed, will not reconnect!'
} as const;

export const webSocketConnection = <TConnection = Connection>(url: string | URL, initOptions?: WebSocketOptions) => {
  const options = { ...defaultOptions, ...initOptions };
  let webSocket: WebSocket | undefined;
  let connection: TConnection | undefined;
  let reconnectTimeout: number | NodeJS.Timeout | undefined;
  let reconnectAttempts = 0;

  const scheduleReconnect = (
    handler: WebSocketConnectionHandler<TConnection>,
    oldConnection?: TConnection
  ): Promise<TConnection> | undefined => {
    if (options.abortSignal?.aborted) {
      return;
    }
    const { reconnect, reconnectAttempts: attempts, reconnectDelay } = options;
    if (reconnect) {
      if (reconnectAttempts >= attempts) {
        handler.logger?.error(options.reconnectFailedMessage.replace('{attempts}', attempts.toString()));
        handler.onClose?.(oldConnection);
      } else {
        return new Promise<TConnection>(resolve => {
          reconnectTimeout = setTimeout(() => {
            handler.logger?.warn(options.reconnectingMessage);
            reconnectAttempts++;
            resolve(listen(handler, true));
          }, reconnectDelay);
        });
      }
    } else {
      handler.logger?.error(options.closeMessage);
      handler.onClose?.(oldConnection);
    }
  };

  const listen = async (handler: WebSocketConnectionHandler<TConnection>, isReconnecting = false): Promise<TConnection> => {
    try {
      webSocket = new WebSocket(url);
    } catch (error) {
      handler.logger?.error(options.errorMessage);
      const reconnectPromise = scheduleReconnect(handler);
      if (reconnectPromise) {
        return reconnectPromise;
      }
      throw error;
    }

    connection = await new Promise<TConnection>((resolve, reject) => {
      if (!webSocket) {
        reject(new Error('WebSocket connection failed to initialize'));
        return;
      }
      webSocket.onerror = () => {
        handler.logger?.error(options.errorMessage);
        clearInterval(reconnectTimeout);
      };

      webSocket.onclose = () => {
        const reconnectPromise = scheduleReconnect(handler);
        if (reconnectPromise) {
          resolve(reconnectPromise);
        } else {
          reject(new Error(options.errorMessage));
        }
      };

      webSocket.onopen = () => {
        if (!webSocket) {
          reject(new Error('WebSocket connection failed to initialize'));
          return;
        }
        clearInterval(reconnectTimeout);
        reconnectAttempts = 0;
        const wrappedSocket = wrap(webSocket);
        const newConnection = { reader: new WebSocketMessageReader(wrappedSocket), writer: new WebSocketMessageWriter(wrappedSocket) };

        webSocket.onclose = () => {
          handler.onReconnecting?.(newConnection, connection);
          scheduleReconnect(handler, connection);
        };

        if (isReconnecting) {
          handler.logger?.info(options.reconnectedMessage);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          resolve(handler.onReconnect(newConnection, connection!));
        } else {
          handler.logger?.log(options.connectedMessage);
          resolve(handler.onConnection(newConnection));
        }
      };
    });
    if (options.abortSignal?.aborted) {
      webSocket?.close();
    } else {
      options.abortSignal?.addEventListener('abort', () => {
        webSocket?.close();
      });
    }
    return connection;
  };

  return { listen };
};
