/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { Client, RequestManager, WebSocketTransport } from '@open-rpc/client-js';
import { randomUUID } from 'crypto';

const SELECT_KIND = 'elementSelected';
const SET_KIND = 'setModel';
const UPDATE_KIND = 'updateModel';

type Action<T = unknown> = {
  action: T;
};
type SelectAction = Action<{ selectedElementsIDs: string[] }>;
type SetModelAction = Action<{ newRoot: { id: string } }>;
type ProcessKind = 'NORMAL' | 'WEB_SERVICE' | 'CALLABLE_SUB' | 'HTML_DIALOG';

export class GlspProtocol {
  private readonly client: Client;
  private readonly glspProtocolVersion = '1.0.0';
  private readonly glspDiagramType = 'ivy-glsp-process';
  private readonly appId: string;
  private readonly processUri: string;
  private readonly sessionId: string;
  private readonly processUUID: string;

  constructor(private readonly kind: ProcessKind = 'NORMAL') {
    const transport = new WebSocketTransport(`ws://${this.serverUrl()}/ivy-glsp-process-editor`);
    this.client = new Client(new RequestManager([transport]));
    this.client.onError(error => console.error(error));
    this.appId = randomUUID();
    this.processUUID = randomUUID();
    this.processUri = `/processes/${this.kind}-${this.processUUID}`;
    this.sessionId = `${this.appId}_${this.processUri}`;
  }

  private async initialize() {
    return this.client.request({ method: 'initialize', params: { applicationId: this.appId, protocolVersion: this.glspProtocolVersion } });
  }

  private async initializeClientSession() {
    return this.client.request({
      method: 'initializeClientSession',
      params: {
        clientSessionId: this.sessionId,
        diagramType: this.glspDiagramType,
        clientActionKinds: [
          'setEditMode',
          'setDirtyState',
          'focusStateChanged',
          'enable-default-tools',
          'enable-tools',
          'resizeElementAction',
          'alignElements',
          'navigateToMarker',
          'setTypeHints',
          'sourceModelChanged',
          'triggerEdgeCreation',
          'setMarkers',
          'status',
          'setBounds',
          'setBoundsFeedback',
          'move',
          'move-initialized-event',
          'move-finished-event',
          'focusDomAction',
          'enableViewport',
          'viewport',
          'ivyViewportZoom',
          'enableToolPalette',
          'showToolBarMenu',
          'showToolBarOptionsMenu',
          'EditLabel',
          'triggerNodeCreation',
          'showGridAction',
          'showQuickActionMenu',
          'showSimpleQuickActionMenu',
          'removeMarquee',
          'quickActionTriggerEdgeCreation',
          'updateColorPalette',
          'jumpInto',
          'elementAnimate',
          'setExecutedElements',
          'elementStopped',
          'message',
          'startProgress',
          'updateProgress',
          'endProgress',
          'switchTheme',
          'showBreakpoints',
          'invokeCopyPaste',
          'navigateToExternalTarget',
          'enableInscription',
          'showInscription',
          'open',
          'initializeCanvasBounds',
          'setModel',
          'setUIExtensionVisibility',
          'updateModel',
          'modifyCSSFeedback',
          'requestBounds',
          'computedBounds',
          'elementSelected',
          'allSelected',
          'selectFeedback',
          'applyTypeHints',
          'commitModel',
          'addRemoveBezierSegment',
          'drawFeedbackEdge',
          'removeFeedbackEdgeCommand',
          'showReconnectHandlesFeedback',
          'hideReconnectHandlesFeedback',
          'drawFeedbackEdgeSource',
          'switchRoutingMode',
          'addTemplateElements',
          'removeTemplateElements',
          'drawMarquee',
          'applyMarkers',
          'deleteMarkers',
          'drawHelperLines',
          'removeHelperLines',
          'getViewport',
          'repositionAction',
          'center',
          'fit',
          'originViewport',
          'moveIntoViewport',
          'bringToFront',
          'applyLabelEdit',
          'showChangeBoundsToolResizeFeedback',
          'hideChangeBoundsToolResizeFeedback',
          'requestExportSvg',
          'gridFeedback',
          'toolPaletteFeedback',
          'showChangeLaneBoundsToolFeedback',
          'hideChangeLaneBoundsToolResizeFeedback',
          'elementAnimateFeedback',
          'executedFeedbackCommand',
          'stoppedFeedbackCommand'
        ]
      }
    });
  }

  private async sendAction(action: any) {
    return this.client.notify({
      method: 'process',
      params: { clientId: this.sessionId, action }
    });
  }

  async initProcess() {
    let processId = '';
    this.client.onNotification(data => {
      if (this.isSetModelAction(data.params)) {
        processId = data.params.action.newRoot.id;
      }
    });
    await this.initialize();
    await this.initializeClientSession();
    await this.sendAction({
      kind: 'requestModel',
      requestId: '',
      options: {
        needsClientLayout: true,
        needsServerLayout: false,
        sourceUri: this.processUri,
        app: process.env.TEST_APP ?? 'designer',
        pmv: 'inscription-test-project',
        pid: '',
        readonly: false,
        diagramType: this.glspDiagramType
      }
    });
    await this.untilTrue(() => processId.length > 0);
    return processId;
  }

  getProcessUUID() {
    return this.processUUID;
  }

  async createElement(processId: string, type: string, location = { x: 200, y: 64 }) {
    let elementId = '';
    this.client.onNotification(data => {
      if (this.isSelectAction(data.params)) {
        elementId = data.params.action.selectedElementsIDs[0]!;
      }
    });
    await this.sendAction({ kind: 'createNode', isOperation: true, elementTypeId: type, location, containerId: processId });
    await this.untilTrue(() => elementId.length > 0);
    return elementId;
  }

  async attachBoundary(targetElementId: string, eventKind: 'error' | 'signal') {
    let elementId = '';
    this.client.onNotification(data => {
      if (this.isSelectAction(data.params)) {
        elementId = data.params.action.selectedElementsIDs[0]!;
      }
    });
    await this.sendAction({ kind: 'attachBoundary', isOperation: true, elementId: targetElementId, eventKind });
    await this.untilTrue(() => elementId.length > 0);
    return elementId;
  }

  async connect(sourceElementId: string, targetElementId: string) {
    let connected = false;
    this.client.onNotification(data => {
      if (this.isUpdateModelAction(data.params)) {
        connected = true;
      }
    });
    await this.sendAction({ kind: 'createEdge', isOperation: true, elementTypeId: 'edge', sourceElementId, targetElementId });
    await this.untilTrue(() => connected);
    return connected;
  }

  private async untilTrue(condition: () => boolean) {
    while (!condition()) {
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for 1 second
    }
    return Promise.resolve();
  }

  private isSelectAction(object: any): object is SelectAction {
    return 'action' in object && 'kind' in object.action && object.action.kind === SELECT_KIND;
  }

  private isSetModelAction(object: any): object is SetModelAction {
    return 'action' in object && 'kind' in object.action && object.action.kind === SET_KIND;
  }

  private isUpdateModelAction(object: any): object is Action {
    return 'action' in object && 'kind' in object.action && object.action.kind === UPDATE_KIND;
  }

  private serverUrl(): string {
    const app = process.env.TEST_APP ?? '';
    const server = process.env.BASE_URL ? process.env.BASE_URL + app : 'localhost:8081/designer';
    return server.replace(/^https?:\/\//, '');
  }
}

export type CreateProcessResult = { processId: string; elementId: string; processUUID: string };

export async function createProcess(
  type: ElementType | `ThirdPartyProgramInterface:${string}`,
  options?: {
    location?: { x: number; y: number };
    connectTo?: ElementType[];
    additionalElements?: ElementType[];
    boundaryType?: 'error' | 'signal';
    processKind?: ProcessKind;
  }
): Promise<CreateProcessResult> {
  const glsp = new GlspProtocol(options?.processKind);
  const processId = await glsp.initProcess();
  let elementId = await glsp.createElement(processId, type, options?.location);
  if (options?.connectTo) {
    for (const connectType of options.connectTo) {
      const newElementId = await glsp.createElement(processId, connectType, { x: 200, y: 200 });
      await glsp.connect(elementId, newElementId);
    }
  }
  if (options?.additionalElements) {
    for (const elementType of options.additionalElements) {
      await glsp.createElement(processId, elementType, { x: 200, y: 200 });
    }
  }
  if (options?.boundaryType) {
    elementId = await glsp.attachBoundary(elementId, options.boundaryType);
  }
  return { processId, elementId, processUUID: glsp.getProcessUUID() };
}
