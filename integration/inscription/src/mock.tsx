import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import {
  App,
  ClientContextProvider,
  LogLevel,
  MonacoEditorUtil,
  QueryProvider,
  initQueryClient
} from '@axonivy/process-editor-inscription-view';
import { ThemeProvider, Toaster } from '@axonivy/ui-components';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { InscriptionClientMock } from './mock/inscription-client-mock';
import { URLParams } from './url-helper';

export async function start(): Promise<void> {
  const readonly = URLParams.parameter('readonly') ? true : false;
  const type = (URLParams.parameter('type') as ElementType) ?? undefined;
  const theme = URLParams.themeMode();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('root element not found');
  }
  const root = createRoot(rootElement);
  const queryClient = initQueryClient();
  const client = new InscriptionClientMock(readonly, type);
  await MonacoEditorUtil.configureMonaco({ theme, logLevel: LogLevel.Debug });
  initTranslation();

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <App app='' pmv='' pid='1' />
            <Toaster closeButton={true} position='bottom-left' />
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
