import { urlBuilder, type Connection } from '@axonivy/jsonrpc';
import { ConsoleTimer, Deferred } from '@axonivy/process-editor-inscription-core';
import { MonacoLanguageUtil } from './monaco-language-util';
import { LogLevel } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export interface IvyLanguageClientConnection {
  server: string | URL;
  connection?: Connection;
  logLevel?: LogLevel;
}

export namespace IvyLanguageClient {
  export function webSocketUrl(url: string | URL): string {
    return urlBuilder(url, 'ivy-script-lsp');
  }

  const _languageClient = new Deferred<void>();
  export async function connected(): Promise<void> {
    return _languageClient.promise;
  }

  let connectCalled = false;
  export async function connect({ server, connection, logLevel }: IvyLanguageClientConnection): Promise<void> {
    if (connectCalled) {
      return connected();
    }
    connectCalled = true;

    const timer = new ConsoleTimer(logLevel === LogLevel.Debug, 'Setup Ivy Language Client').start();

    timer.step('Wait for Monaco API...');
    await MonacoUtil.monaco();

    timer.step('Start Language Client...');
    await MonacoLanguageUtil.setLanguageClient({
      server: webSocketUrl(server),
      connection,
      logLevel,
      reconnect: true,
      reconnectAttempts: 20,
      reconnectDelay: 500
    });

    timer.end();
    _languageClient.resolve();
    return _languageClient.promise;
  }
}
