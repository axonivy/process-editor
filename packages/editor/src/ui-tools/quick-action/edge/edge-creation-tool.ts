import { IvyIcons } from '@axonivy/ui-icons';
import {
  Action,
  AnchorComputerRegistry,
  type Args,
  BaseCreationTool,
  CreateEdgeOperation,
  CursorCSS,
  DragAwareMouseListener,
  DrawFeedbackEdgeAction,
  EnableDefaultToolsAction,
  FeedbackEdgeEndMovingMouseListener,
  GEdge,
  GModelElement,
  GNode,
  Operation,
  ReconnectEdgeOperation,
  RemoveFeedbackEdgeAction,
  cursorFeedbackAction,
  findParentByFeature,
  hasStringProp,
  isConnectable,
  isCtrlOrCmd
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { type QuickAction, SingleQuickActionProvider } from '../quick-action';
import { isMultipleOutgoingEdgesFeature } from './model';

/**
 * Tool to create connections in a Diagram, by selecting a source and target node.
 */
@injectable()
export class QuickActionEdgeCreationTool extends BaseCreationTool<QuickActionTriggerEdgeCreationAction> {
  static ID = 'quick-action-edge-creation-tool';

  @inject(AnchorComputerRegistry) protected anchorRegistry!: AnchorComputerRegistry;

  protected isTriggerAction = QuickActionTriggerEdgeCreationAction.is;

  protected creationToolMouseListener?: QuickActionEdgeCreationToolMouseListener;
  protected feedbackEndMovingMouseListener?: FeedbackEdgeEndMovingMouseListener;

  get id(): string {
    return QuickActionEdgeCreationTool.ID;
  }

  doEnable(): void {
    this.creationToolMouseListener = new QuickActionEdgeCreationToolMouseListener(this.triggerAction, this);
    this.feedbackEndMovingMouseListener = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry, this.feedbackDispatcher);
    this.toDisposeOnDisable.push(this.mouseTool.registerListener(this.creationToolMouseListener));
    this.toDisposeOnDisable.push(this.mouseTool.registerListener(this.feedbackEndMovingMouseListener));
    this.toDisposeOnDisable.push(
      this.registerFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)], this, [
        RemoveFeedbackEdgeAction.create(),
        cursorFeedbackAction()
      ])
    );
  }
}

export class QuickActionEdgeCreationToolMouseListener extends DragAwareMouseListener {
  protected source?: string;
  protected target?: string;
  protected currentTarget?: GModelElement;
  protected allowedTarget = false;
  protected proxyEdge: GEdge;

  constructor(
    protected triggerAction: QuickActionTriggerEdgeCreationAction,
    protected tool: QuickActionEdgeCreationTool
  ) {
    super();
    this.proxyEdge = new GEdge();
    this.proxyEdge.type = triggerAction.elementTypeId;
    this.proxyEdge.sourceId = triggerAction.sourceId;
    this.source = this.triggerAction.sourceId;
    this.tool.registerFeedback([DrawFeedbackEdgeAction.create({ elementTypeId: this.triggerAction.elementTypeId, sourceId: this.source })]);
  }

  protected reinitialize(): void {
    this.source = undefined;
    this.target = undefined;
    this.currentTarget = undefined;
    this.allowedTarget = false;
    this.tool.registerFeedback([RemoveFeedbackEdgeAction.create()]);
  }

  override nonDraggingMouseUp(_element: GModelElement, event: MouseEvent): Action[] {
    const result: Action[] = [];
    if (event.button === 0) {
      if (this.currentTarget /* && this.allowedTarget*/) {
        this.target = this.currentTarget.id;
      }
      if (this.source && this.target) {
        result.push(this.edgeOperation(this.source, this.target));
        if (!isCtrlOrCmd(event)) {
          result.push(EnableDefaultToolsAction.create());
        } else {
          this.reinitialize();
        }
      }
    } else if (event.button === 2) {
      result.push(EnableDefaultToolsAction.create());
    }
    return result;
  }

  private edgeOperation(sourceId: string, targetId: string): Operation {
    if (this.triggerAction.reconnect && this.triggerAction.edgeId) {
      return ReconnectEdgeOperation.create({
        edgeElementId: this.triggerAction.edgeId,
        sourceElementId: sourceId,
        targetElementId: targetId,
        args: this.triggerAction.args
      });
    }
    return CreateEdgeOperation.create({
      elementTypeId: this.triggerAction.elementTypeId,
      sourceElementId: sourceId,
      targetElementId: targetId,
      args: this.triggerAction.args
    });
  }

  protected isSourceSelected(): boolean {
    return this.source !== undefined;
  }

  protected isTargetSelected(): boolean {
    return this.target !== undefined;
  }

  override mouseOver(target: GModelElement) {
    const newCurrentTarget = findParentByFeature(target, isConnectable);
    if (newCurrentTarget !== this.currentTarget) {
      this.currentTarget = newCurrentTarget;
      if (this.currentTarget) {
        if (!this.isSourceSelected()) {
          this.allowedTarget = this.isAllowedSource(newCurrentTarget);
        } else if (!this.isTargetSelected()) {
          this.allowedTarget = this.isAllowedTarget(newCurrentTarget);
        }
        if (this.allowedTarget) {
          const action = !this.isSourceSelected()
            ? cursorFeedbackAction(CursorCSS.EDGE_CREATION_SOURCE)
            : cursorFeedbackAction(CursorCSS.EDGE_CREATION_TARGET);
          return [action];
        }
      }
      return [cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)];
    }
    return [];
  }

  protected isAllowedSource(element: GModelElement | undefined): boolean {
    return element !== undefined && isConnectable(element) && element.canConnect(this.proxyEdge, 'source');
  }

  protected isAllowedTarget(element: GModelElement | undefined): boolean {
    return element !== undefined && isConnectable(element) && element.canConnect(this.proxyEdge, 'target');
  }
}

export interface QuickActionTriggerEdgeCreationAction extends Action {
  kind: typeof QuickActionTriggerEdgeCreationAction.KIND;
  elementTypeId: string;
  sourceId: string;
  reconnect?: boolean;
  edgeId?: string;
  args?: Args;
}

export namespace QuickActionTriggerEdgeCreationAction {
  export const KIND = 'quickActionTriggerEdgeCreation';

  export function is(object: unknown): object is QuickActionTriggerEdgeCreationAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementTypeId') && hasStringProp(object, 'sourceId');
  }

  export function create(
    elementTypeId: string,
    sourceId: string,
    options: { reconnect?: boolean; edgeId?: string; args?: Args } = {}
  ): QuickActionTriggerEdgeCreationAction {
    return {
      kind: KIND,
      elementTypeId,
      sourceId,
      ...options
    };
  }
}

@injectable()
export class ConnectQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    const edge = new GEdge();
    edge.type = 'edge';
    if (
      element instanceof GNode &&
      element.canConnect(edge, 'source') &&
      (Array.from(element.outgoingEdges).length === 0 || isMultipleOutgoingEdgesFeature(element))
    ) {
      return {
        icon: IvyIcons.Connector,
        title: t('quickAction.connect'),
        location: 'Right',
        sorting: 'Z',
        action: QuickActionTriggerEdgeCreationAction.create('edge', element.id)
      };
    }
    return undefined;
  }
}
