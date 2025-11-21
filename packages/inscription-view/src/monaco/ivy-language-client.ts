import { urlBuilder, type Connection } from '@axonivy/jsonrpc';
import { ConsoleTimer, Deferred } from '@axonivy/process-editor-inscription-core';
import type { LanguageClientWrapper } from 'monaco-languageclient/lcwrapper';
import { IvyMacroLanguage } from './ivy-macro-language';
import { IvyScriptLanguage } from './ivy-script-language';
import { MonacoLanguageUtil } from './monaco-language-util';
import { LogLevel } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export interface IvyLangaugeClientConnection {
  server: string | URL;
  connection?: Connection;
  logLevel?: LogLevel;
}

export namespace IvyLanguageClient {
  export function webSocketUrl(url: string | URL): string {
    return urlBuilder(url, 'ivy-script-lsp');
  }

  const _languageClient = new Deferred<LanguageClientWrapper>();
  export async function connected(): Promise<LanguageClientWrapper> {
    return _languageClient.promise;
  }

  let connectCalled = false;
  export async function connect({ server, connection, logLevel }: IvyLangaugeClientConnection): Promise<LanguageClientWrapper> {
    if (connectCalled) {
      return connected();
    }
    connectCalled = true;

    const timer = new ConsoleTimer(logLevel === LogLevel.Debug, 'Setup Ivy Language Client').start();

    timer.step('Wait for Monaco API...');
    await MonacoUtil.monaco();

    timer.step('Wait for VSCode Services to be ready...');
    await MonacoUtil.vscodeServicesReady();

    timer.step('Initialize language client...');
    const client = await MonacoLanguageUtil.setLanguageClient({
      languageId: IvyScriptLanguage.Language.id,
      clientOptions: {
        outputChannelName: 'IvyScript Language Client',
        documentSelector: [{ language: IvyScriptLanguage.Language.id }, { language: IvyMacroLanguage.Language.id }]
      },
      connection: {
        options: { $type: 'WebSocketUrl', url: webSocketUrl(server) },
        messageTransports: connection
      },
      restartOptions: {
        retries: 20,
        timeout: 500
      }
    });

    timer.step('Start language client...');
    await client.start();

    timer.end();
    _languageClient.resolve(client);
    return _languageClient.promise;
  }
}
