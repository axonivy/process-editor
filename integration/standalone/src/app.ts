import { IvyBaseJsonrpcGLSPClient, prefsColorScheme } from '@axonivy/process-editor';
import { MonacoEditorUtil } from '@axonivy/process-editor-inscription-view';
import type { ThemeMode } from '@axonivy/process-editor-protocol';
import type { IActionDispatcher } from '@eclipse-glsp/client';
import { DiagramLoader, EditMode, GLSPWebSocketProvider, MessageAction, StatusAction, TYPES } from '@eclipse-glsp/client';
import { ApplicationIdProvider, GLSPClient } from '@eclipse-glsp/protocol';
import type { Container } from 'inversify';
import type { MessageConnection } from 'vscode-jsonrpc';
import createContainer from './di.config';
import { initTranslation } from './i18n';
import './index.css';
import { getParameters, getServerDomain, isReadonly, isSecureConnection } from './url-helper';

const parameters = getParameters();
const app = parameters.get('app') ?? 'designer';
let server = parameters.get('server');
if (!server) {
  server = getServerDomain().replace(app, '');
}

const pmv = parameters.get('pmv') ?? '';
const pid = parameters.get('pid') ?? '';
const sourceUri = parameters.get('file') ?? '';
const select = parameters.get('select');
const theme = (parameters.get('theme') as ThemeMode) ?? prefsColorScheme();
const debug = parameters.has('debug', 'true');

const id = 'ivy-glsp-process-editor';
const diagramType = 'ivy-glsp-process';
const clientId = ApplicationIdProvider.get() + '_' + sourceUri + pid;

const webSocketBase = `${isSecureConnection() ? 'wss' : 'ws'}://${server}/`;
const webSocketUrl = `${webSocketBase}${app}/${id}`;

let glspClient: GLSPClient;
let container: Container;
const wsProvider = new GLSPWebSocketProvider(webSocketUrl);
wsProvider.listen({ onConnection: initialize, onReconnect: reconnect, logger: console });
initMonaco();
initTranslation();

async function initialize(connectionProvider: MessageConnection, isReconnecting = false): Promise<void> {
  glspClient = new IvyBaseJsonrpcGLSPClient({ id, connectionProvider });
  container = createContainer({
    clientId,
    diagramType,
    glspClientProvider: async () => glspClient,
    sourceUri,
    editMode: isReadonly() ? EditMode.READONLY : EditMode.EDITABLE,
    select,
    theme,
    inscriptionContext: {
      app,
      pmv,
      server: webSocketBase
    }
  });

  const diagramLoader = container.get(DiagramLoader);
  await diagramLoader.load({
    // Our custom server needs the 'readonly' argument here as well and not only set through the edit mode in the diagram options
    requestModelOptions: { isReconnecting, app, pmv, pid, readonly: isReadonly() },
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

async function initMonaco(): Promise<void> {
  // packaging with vite has it's own handling of workers so it can be properly accessed
  // we therefore import the worker here and use that instead of the default mechanism
  const worker = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
  MonacoEditorUtil.configureInstance({ theme, debug, worker: { workerConstructor: worker.default } });
}
