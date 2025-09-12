import { AttachBoundaryOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  Action,
  CreateNodeOperation,
  GConnectableElement,
  GEdge,
  GModelElement,
  isConnectable,
  isNotUndefined,
  Operation,
  PaletteItem,
  TriggerNodeCreationAction
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { canAddErrorBoundary, canAddSignalBoundary } from '../../../diagram/boundary/model';
import { ActivityTypes, EventBoundaryTypes } from '../../../diagram/view-types';
import { ElementsPaletteHandler } from '../../tool-bar/node/action-handler';
import { type QuickAction, SingleQuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { QuickActionUI } from '../quick-action-ui';

export abstract class CreateElementQuickActionProvider extends SingleQuickActionProvider {
  @inject(ElementsPaletteHandler) protected paletteHandler!: ElementsPaletteHandler;
  protected element?: GModelElement;

  singleQuickAction(element: GModelElement) {
    this.element = element;
    if (!isConnectable(element) || !element.canConnect(new GEdge(), 'source') || element.type === ActivityTypes.COMMENT) {
      return;
    }
    return this.quickAction();
  }

  protected hasOutgoingEdges() {
    return this.element instanceof GConnectableElement && Array.from(this.element.outgoingEdges).length > 0;
  }

  protected paletteItems() {
    return () => this.paletteHandler.getPaletteItems().filter(item => !this.filterPaletteGroups().includes(item.id));
  }

  protected filterPaletteGroups() {
    const filterGroup = ['event-start-group', 'swimlane-group'];
    if (this.hasOutgoingEdges()) {
      filterGroup.push('event-end-group');
    }
    return filterGroup;
  }

  protected actions = (paletteItem: PaletteItem, elementIds: string[]): Action[] => [
    QuickActionUI.hide(),
    ...paletteItem.actions.map(itemAction => convertToCreateNodeOperation(itemAction, elementIds[0] ?? '')).filter(isNotUndefined)
  ];

  protected quickActionItem(): PaletteItem {
    return { id: '', actions: [], label: '', sortString: '' };
  }

  quickAction(): QuickAction | undefined {
    const item = this.quickActionItem();
    if (!this.element) {
      return undefined;
    }
    return {
      icon: item.icon as IvyIcons,
      title: `${item.label} (A)`,
      location: 'Right',
      sorting: item.sortString,
      action: ShowQuickActionMenuAction.create({
        elementIds: [this.element.id],
        paletteItems: this.paletteItems(),
        actions: this.actions
      }),
      readonlySupport: false,
      letQuickActionsOpen: true
    };
  }
}

@injectable()
export class CreateEventQuickActionProvider extends CreateElementQuickActionProvider {
  override paletteItems() {
    return () => {
      const items = this.paletteHandler.getPaletteItems().filter(item => this.filterPaletteGroups().includes(item.id));
      if (this.element) {
        const boundaries = boundaryEventGroup(this.element);
        if (boundaries) {
          items.push(boundaries);
        }
      }
      return items;
    };
  }

  protected override filterPaletteGroups(): string[] {
    const paletteGroups = ['event-intermediate-group'];
    if (!this.hasOutgoingEdges()) {
      paletteGroups.push('event-end-group');
    }
    return paletteGroups;
  }

  override quickActionItem(): PaletteItem {
    return { label: t('toolbar.events'), icon: IvyIcons.Start, sortString: 'A', id: '', actions: [] };
  }
}

@injectable()
export class CreateGatewayQuickActionProvider extends CreateElementQuickActionProvider {
  override paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'gateway-group');
  }

  override quickActionItem(): PaletteItem {
    return { label: t('toolbar.gateways'), icon: IvyIcons.GatewaysGroup, sortString: 'B', id: '', actions: [] };
  }
}

@injectable()
export class CreateActivityQuickActionProvider extends CreateElementQuickActionProvider {
  override paletteItems(): () => PaletteItem[] {
    return () =>
      this.paletteHandler
        .getPaletteItems()
        .filter(item => item.id === 'activity-group' || item.id === 'interface-activity-group' || item.id === 'bpmn-activity-group');
  }

  override quickActionItem(): PaletteItem {
    return { label: t('toolbar.activities'), icon: IvyIcons.ActivitiesGroup, sortString: 'C', id: '', actions: [] };
  }
}

@injectable()
export class CreateAllElementsQuickActionProvider extends CreateElementQuickActionProvider {
  override quickAction(): QuickAction | undefined {
    if (!this.element) {
      return undefined;
    }
    return {
      icon: IvyIcons.Task,
      title: 'Create Node',
      location: 'Hidden',
      sorting: 'Z',
      action: ShowQuickActionMenuAction.create({
        elementIds: [this.element.id],
        paletteItems: this.paletteItems(),
        actions: this.actions,
        showSearch: true
      }),
      letQuickActionsOpen: true,
      readonlySupport: false,
      shortcut: 'KeyA'
    };
  }
}

export function convertToCreateNodeOperation(action: Action, previousElementId: string): Operation | undefined {
  if (TriggerNodeCreationAction.is(action)) {
    return CreateNodeOperation.create(action.elementTypeId, { args: { previousElementId: previousElementId } });
  }
  if (AttachBoundaryOperation.is(action)) {
    return action;
  }
  return undefined;
}

function boundaryEventGroup(element: GModelElement): PaletteItem | undefined {
  const children: PaletteItem[] = [];
  if (canAddErrorBoundary(element)) {
    children.push({
      id: 'error-boundary',
      label: 'Error Boundary',
      sortString: 'A',
      actions: [AttachBoundaryOperation.create({ elementId: element.id, eventKind: 'error' })],
      icon: EventBoundaryTypes.BOUNDARY_ERROR
    });
  }
  if (canAddSignalBoundary(element)) {
    children.push({
      id: 'signal-boundary',
      label: 'Signal Boundary',
      sortString: 'B',
      actions: [AttachBoundaryOperation.create({ elementId: element.id, eventKind: 'signal' })],
      icon: EventBoundaryTypes.BOUNDARY_SIGNAL
    });
  }
  if (children.length === 0) {
    return undefined;
  }
  return {
    id: 'boundary-group',
    label: 'Boundary Events',
    sortString: 'Z',
    actions: [],
    children: children
  };
}
