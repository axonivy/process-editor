import { IvyBaseJsonrpcGLSPClient, prefsColorScheme } from '@axonivy/process-editor';
import type { IActionDispatcher } from '@eclipse-glsp/client';
import { DiagramLoader, EditMode, GLSPWebSocketProvider, MessageAction, StatusAction, TYPES } from '@eclipse-glsp/client';
import { ApplicationIdProvider, GLSPClient } from '@eclipse-glsp/protocol';
import type { Container } from 'inversify';
import type { MessageConnection } from 'vscode-jsonrpc';
import createContainer from './di.config';
import { initTranslation } from './i18n';
import './index.css';
import { params } from './url-helper';

const { webSocketUrl, app, pmv, pid, sourceUri, highlight, select, zoom, theme, previewMode } = params(
  new URL(window.location.href),
  prefsColorScheme
);

const id = 'ivy-glsp-process-viewer';
const diagramType = 'ivy-glsp-process';
const clientId = ApplicationIdProvider.get() + '_' + sourceUri + pid;

let glspClient: GLSPClient;
let container: Container;
const wsProvider = new GLSPWebSocketProvider(`${webSocketUrl}/${id}`, { reconnectDelay: 5000, reconnectAttempts: 120 });
wsProvider.listen({ onConnection: initialize, onReconnect: reconnect, logger: console });

initTranslation();

async function initialize(connectionProvider: MessageConnection, isReconnecting = false): Promise<void> {
  glspClient = new IvyBaseJsonrpcGLSPClient({ id, connectionProvider });
  container = createContainer({
    clientId,
    diagramType,
    glspClientProvider: async () => glspClient,
    sourceUri,
    editMode: EditMode.READONLY,
    highlight,
    select,
    zoom,
    theme,
    previewMode
  });

  const diagramLoader = container.get(DiagramLoader);
  await diagramLoader.load({
    // Our custom server needs the 'readonly' argument here as well and not only set through the edit mode in the diagram options
    requestModelOptions: { isReconnecting, app, pmv, pid, highlight, readonly: true, diagramType },
    initializeParameters: {
      applicationId: ApplicationIdProvider.get(),
      protocolVersion: GLSPClient.protocolVersion
    }
  });

  const actionDispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);
  if (isReconnecting) {
    const message = `Connection to the ${id} glsp server got closed. Connection was successfully re-established.`;
    const timeout = 5000;
    const severity = 'WARNING';
    actionDispatcher.dispatchAll([StatusAction.create(message, { severity, timeout }), MessageAction.create(message, { severity })]);
  }
}

async function reconnect(connectionProvider: MessageConnection): Promise<void> {
  glspClient.stop();
  initialize(connectionProvider, true /* isReconnecting */);
}
