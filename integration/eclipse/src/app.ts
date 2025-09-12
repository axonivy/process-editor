import { DiagramLoader } from '@eclipse-glsp/client';

import { IvyBaseJsonrpcGLSPClient } from '@axonivy/process-editor';
import { MonacoEditorUtil } from '@axonivy/process-editor-inscription-view';
import { getParameters } from '@eclipse-glsp/ide';
import { ApplicationIdProvider, GLSPClient, GLSPWebSocketProvider } from '@eclipse-glsp/protocol';
import type { MessageConnection } from 'vscode-jsonrpc';

import type { ThemeMode } from '@axonivy/process-editor-protocol';
import type { Container } from 'inversify';
import createContainer from './di.config';
import { initTranslation } from './i18n';
import './index.css';

const urlParameters = getParameters();
const filePath = urlParameters.path ?? '';
// Java's URLEncoder.encode encodes spaces as plus sign but decodeURI expects spaces to be encoded as %20.
// See also https://en.wikipedia.org/wiki/Query_string#URL_encoding for URL encoding in forms vs generic URL encoding.
const sourceUri = 'file://' + decodeURI(filePath.replace(/\+/g, '%20'));

// In the Eclipse Integration, port is dynamic, as multiple editors
// and/or Eclipse Servers may be running in parallel (e.g. 1/Eclipse IDE)
const port = parseInt(urlParameters.port ?? '', 10);
const applicationId = urlParameters.application;
const id = 'ivy-glsp-eclipse-process-editor';
const diagramType = 'ivy-glsp-process';
const theme = (urlParameters.theme as ThemeMode) ?? 'light';
const clientId = urlParameters.client || ApplicationIdProvider.get();
const widgetId = urlParameters.widget || clientId;
const showGrid = urlParameters.grid ? urlParameters.grid === 'true' : false;
const debug = urlParameters.debug ? urlParameters.debug === 'true' : false;
setWidgetId(widgetId);

const webSocketUrl = `ws://localhost:${port}/${id}`;

let glspClient: GLSPClient;
let container: Container;
const wsProvider = new GLSPWebSocketProvider(webSocketUrl);
wsProvider.listen({ onConnection: initialize, onReconnect: reconnect, logger: console });
initMonaco();
initTranslation();

async function initialize(connectionProvider: MessageConnection, isReconnecting = false): Promise<void> {
  glspClient = new IvyBaseJsonrpcGLSPClient({ id, connectionProvider });
  container = createContainer(widgetId, {
    clientId,
    diagramType,
    glspClientProvider: async () => glspClient,
    sourceUri,
    theme,
    showGrid
  });
  const diagramLoader = container.get(DiagramLoader);
  await diagramLoader.load({
    requestModelOptions: { isReconnecting },
    initializeParameters: {
      applicationId,
      protocolVersion: GLSPClient.protocolVersion
    }
  });
}

function setWidgetId(mainWidgetId: string): void {
  const mainWidget = document.getElementById('sprotty');
  if (mainWidget) {
    mainWidget.id = mainWidgetId;
  }
}

async function reconnect(connectionProvider: MessageConnection): Promise<void> {
  glspClient.stop();
  initialize(connectionProvider, true /* isReconnecting */);
}

async function initMonaco(): Promise<void> {
  // packaging with vite has it's own handling of workers so it can be properly accessed
  // we therefore import the worker here and use that instead of the default mechanism
  const worker = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
  MonacoEditorUtil.configureInstance({ theme, debug, worker: { workerConstructor: worker.default } });
}
