import { type Connection, type Disposable, DisposableCollection, type WebSocketOptions } from '@axonivy/jsonrpc';
import { DeferredValue, type WebSocketConnection, webSocketConnection } from '@axonivy/process-editor-inscription-core';
import {
  BaseMessageTransport,
  ConsoleMessageLogger,
  EventEmitter,
  type IMessageLogger,
  type IMessageTransport,
  type Message,
  StreamLogger
} from '@hediet/json-rpc';
import type { IvyLanguageClientConnection } from './ivy-language-client';
import { LogLevel, type MonacoApi, type monaco } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export namespace MonacoLanguageUtil {
  export const session = { id: 0 };
  const monacoLanguageClientReconnectedEmitter = new EventEmitter<typeof session.id>();
  export const onLanguageClientReconnected = monacoLanguageClientReconnectedEmitter.event;

  export async function setLanguageClient({
    server,
    connection,
    logLevel,
    ...webSocketOptions
  }: IvyLanguageClientConnection & WebSocketOptions): Promise<monaco.lsp.MonacoLspClient> {
    const monaco = await MonacoUtil.monaco();
    if (connection) {
      const transport = new ConnectionTransport(connection, monaco);
      return new monaco.lsp.MonacoLspClient(logLevel === LogLevel.Debug ? transport.log() : transport);
    }
    const transport = new ReconnectingWebSocketTransport(server, webSocketOptions, logLevel, monaco);
    transport.onReconnect(() => monacoLanguageClientReconnectedEmitter.fire(session.id++));
    return new monaco.lsp.MonacoLspClient(logLevel === LogLevel.Debug ? transport.log() : transport);
  }

  export async function isInstalled(languageId: string, monacoApi?: MonacoApi): Promise<boolean> {
    const monaco = await MonacoUtil.resolve(monacoApi);
    const languages = monaco.languages.getLanguages();
    return languages.some(lang => lang.id === languageId);
  }
}

export class FixedStreamLogger extends StreamLogger {
  constructor(
    baseStream: IMessageTransport,
    logger: IMessageLogger,
    protected monaco: MonacoApi
  ) {
    super(baseStream, logger);
  }

  override send(message: Message): Promise<void> {
    return super.send(message);
  }
}

export class ConnectionTransport extends BaseMessageTransport implements Disposable {
  private toDispose = new DisposableCollection();

  private readonly errorEmitter = new EventEmitter<{ error: unknown }>();
  public readonly onError = this.errorEmitter.event;

  constructor(
    protected connection: Connection,
    protected monaco: MonacoApi
  ) {
    super();

    this.toDispose.push(connection.writer.onError(error => this.errorEmitter.fire({ error })));
    this.toDispose.push(connection.reader.onError(error => this.errorEmitter.fire({ error })));
    this.toDispose.push(connection.reader.listen(message => this._dispatchReceivedMessage(message as Message)));
    this.toDispose.push(connection.reader.onClose(() => this._onConnectionClosed()));
  }

  protected override _sendImpl(message: Message): Promise<void> {
    return this.connection.writer.write(message);
  }

  override log(logger: IMessageLogger = new ConsoleMessageLogger()): IMessageTransport {
    return new FixedStreamLogger(this, logger, this.monaco);
  }

  override toString(): string {
    return `${this.id}@Connection`;
  }

  dispose(): void {
    this.toDispose.dispose();
  }
}

// monaco-lsp-client only exposes a few functions so we need to use some imports from the base frameworks, cf. https://github.com/microsoft/monaco-editor/blob/main/monaco-lsp-client/src/index.ts
// WebSocketTransport has a private constructor so we cannot re-use it
export class ReconnectingWebSocketTransport extends BaseMessageTransport {
  private readonly errorEmitter = new EventEmitter<{ error: unknown }>();
  public readonly onError = this.errorEmitter.event;

  private readonly reconnectEmitter = new EventEmitter<void>();
  public readonly onReconnect = this.reconnectEmitter.event;

  private webSocketTransport = new DeferredValue<ConnectionTransport>();

  constructor(
    protected url: string | URL,
    initOptions: WebSocketOptions | undefined,
    logLevel: LogLevel | undefined,
    protected monaco: MonacoApi
  ) {
    super();

    webSocketConnection(url, initOptions).listen({
      onConnection: connection => this.initialize(connection),
      onReconnect: connection => this.initialize(connection),
      onReconnecting: () => this.reset(),
      onClose: () => this.close(),
      logger: logLevel !== LogLevel.Off ? console : undefined
    });
  }

  protected initialize(connection: WebSocketConnection): WebSocketConnection {
    const transport = new ConnectionTransport(connection, this.monaco);
    transport.setListener(message => this._dispatchReceivedMessage(message));
    transport.onError(error => this.errorEmitter.fire(error));

    this.webSocketTransport.resolve(transport);
    this._onConnectionOpen();
    return connection;
  }

  protected reset(): void {
    this.webSocketTransport.value?.dispose();
    this.webSocketTransport = new DeferredValue<ConnectionTransport>();
    this._onConnectionClosed();
  }

  protected close(): void {
    this.webSocketTransport.value?.dispose();
    this.webSocketTransport.reject(new Error('WebSocket connection closed'));
  }

  protected _onConnectionOpen(): void {
    const previousState = this.state.value?.state;
    this.state.value = { state: 'open' };
    if (previousState === 'closed') {
      this.reconnectEmitter.fire();
    }
  }

  public override async _sendImpl(message: Message): Promise<void> {
    const transport = await this.webSocketTransport.promise;
    return transport.send(message);
  }

  override log(logger: IMessageLogger = new ConsoleMessageLogger()): IMessageTransport {
    return new FixedStreamLogger(this, logger, this.monaco);
  }

  public toString(): string {
    return `${this.id}@${this.url}`;
  }
}
