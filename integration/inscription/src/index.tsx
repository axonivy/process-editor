import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import { InscriptionClientJsonRpc } from '@axonivy/process-editor-inscription-core';
import {
  App,
  ClientContextProvider,
  IvyLanguageClient,
  LogLevel,
  MonacoEditorUtil,
  QueryProvider,
  initQueryClient
} from '@axonivy/process-editor-inscription-view';
import { Flex, Spinner, ThemeProvider, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { URLParams } from './url-helper';

export async function start(): Promise<void> {
  const server = URLParams.webSocketBase();
  const app = URLParams.app();
  const pmv = URLParams.pmv();
  const pid = URLParams.pid();
  const theme = URLParams.themeMode();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('root element not found');
  }
  const root = createRoot(rootElement);
  initTranslation();

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await InscriptionClientJsonRpc.startClient(connection);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryProvider client={queryClient}>
              <App app={app} pmv={pmv} pid={pid} />
              <Toaster closeButton={true} position='bottom-left' />
            </QueryProvider>
          </ClientContextProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: InscriptionClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<InscriptionClientJsonRpc>(InscriptionClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: console
  });

  // trigger initialization but no need to wait for anything here
  MonacoEditorUtil.configureMonaco({ theme, logLevel: LogLevel.Debug });
  IvyLanguageClient.connect({ server, logLevel: LogLevel.Debug });
}

start();
