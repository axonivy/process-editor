import {
  Action,
  Bounds,
  type BoundsAware,
  CursorCSS,
  GEdge,
  GLabel,
  GModelElement,
  GModelRoot,
  GRoutableElement,
  type IActionDispatcherProvider,
  type IActionHandler,
  ISelectionListener,
  MouseListener,
  RemoveMarqueeAction,
  SelectAllAction,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  getAbsoluteBounds,
  isNotUndefined
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import React from 'react';

import { Edge, EdgeLabel } from '../../diagram/model';
import { IVY_TYPES } from '../../types';
import { getAbsoluteEdgeBounds } from '../../utils/diagram-utils';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import { QuickActionUI as QuickActionUIComponent } from './components/QuickActionUI';
import { isQuickActionAware } from './model';
import type { QuickAction, QuickActionProvider } from './quick-action';
import { ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from './quick-action-menu-ui';

@injectable()
export class QuickActionUI extends ReactUIExtension implements IActionHandler, ISelectionListener {
  static readonly ID = 'quickActionsUi';

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider!: IActionDispatcherProvider;
  @inject(SelectionService) protected selectionService!: SelectionService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders!: QuickActionProvider[];

  private activeQuickActions: QuickAction[] = [];
  private activeQuickAction?: string;
  private activeMenuAction?: ShowQuickActionMenuAction | ShowInfoQuickActionMenuAction;

  public id(): string {
    return QuickActionUI.ID;
  }

  @postConstruct()
  protected init(): void {
    this.selectionService.onSelectionChanged(event => this.selectionChanged(event.root, event.selectedElements));
  }

  public containerClass(): string {
    return 'quick-actions-container';
  }

  public getActiveQuickActions(): QuickAction[] {
    return this.activeQuickActions;
  }

  protected override initializeContents(containerElement: HTMLElement): void {
    super.initializeContents(containerElement);
    containerElement.style.position = 'absolute';
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  selectionChanged(root: Readonly<GModelRoot>, selectedElements: string[]): void {
    if (this.editorContext.modelRoot.cssClasses?.includes(CursorCSS.MARQUEE) || selectedElements.length < 1) {
      this.hideUi();
    } else {
      this.showUi();
    }
  }

  handle(action: Action) {
    if (ShowQuickActionMenuAction.is(action)) {
      this.showItemMenu(action);
    }
    if (ShowInfoQuickActionMenuAction.is(action)) {
      this.showSimpleMenu(action);
    }
    if (RemoveMarqueeAction.is(action) && this.editorContext.selectedElements.length > 0) {
      this.showUi();
    }
  }

  private showSimpleMenu(action: ShowInfoQuickActionMenuAction): void {
    this.activeMenuAction = action;
    this.update();
  }

  private async showItemMenu(action: ShowQuickActionMenuAction): Promise<void> {
    if (action.elementIds.length > 0) {
      this.activeMenuAction = action;
      this.update();
    } else {
      this.setActiveQuickAction();
    }
  }

  public updateUI(): void {
    if (this.selectionService.getSelectedElementIDs().length === 0) {
      this.hideUi();
    } else {
      this.showUi();
    }
  }

  public showUi(): void {
    this.activeQuickActions = [];
    this.activeQuickAction = undefined;
    this.activeMenuAction = undefined;
    this.actionDispatcherProvider().then(actionDispatcher =>
      actionDispatcher.dispatch(QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]))
    );
  }

  public hideUi(): void {
    this.activeQuickActions = [];
    this.activeQuickAction = undefined;
    this.activeMenuAction = undefined;
    this.actionDispatcherProvider().then(actionDispatcher => actionDispatcher.dispatch(QuickActionUI.hide()));
  }

  protected getQuickActionElements(root: Readonly<GModelRoot>, ...contextElementIds: string[]) {
    const elements = getElements(contextElementIds, root);
    const elementsWithoutEdges = elements.filter(e => !(e instanceof GRoutableElement) || !(e instanceof Edge));
    if (elementsWithoutEdges.length > 1) {
      // multiple nodes
      return elementsWithoutEdges;
    }
    if (elements.length === 1 && elements[0] instanceof GEdge && isQuickActionAware(elements[0])) {
      const edge = elements[0] as GEdge & BoundsAware;
      if (isNotUndefined(edge) && !edge.id.endsWith('_feedback_edge') && edge.source && edge.target) {
        // single edge
        return [edge];
      }
    }
    const element = getFirstQuickActionElement(elementsWithoutEdges);
    if (isNotUndefined(element)) {
      // any quick action-aware element
      return [element];
    }
    return [];
  }

  protected render(root: Readonly<GModelRoot>, ...contextElementIds: string[]): React.ReactNode {
    if (!this.isContainerVisible()) {
      return null;
    }
    const elements = this.getQuickActionElements(root, ...contextElementIds);
    if (elements.length > 1) {
      this.activeQuickActions = this.loadMultiQuickActions(elements);
    } else if (elements[0]) {
      this.activeQuickActions = this.loadSingleQuickActions(elements[0]);
    } else {
      return null;
    }

    let bounds = elements
      .filter(element => !(element instanceof EdgeLabel))
      .map(element => getAbsoluteBounds(element))
      .filter(Bounds.isValid)
      .reduce(Bounds.combine, Bounds.EMPTY);
    if (elements.length === 1 && elements[0] instanceof GEdge && isQuickActionAware(elements[0])) {
      bounds = getAbsoluteEdgeBounds(elements[0]);
    }

    return (
      <QuickActionUIComponent
        quickActions={this.activeQuickActions}
        activeQuickAction={this.activeQuickAction}
        onQuickActionClick={this.handleQuickActionClick}
        bounds={bounds}
        drawSelectionBox={elements.length > 1}
        showMenuAction={this.activeMenuAction}
        actionDispatcher={this.actionDispatcherProvider}
        closeMenu={() => this.closeMenu()}
        closeUi={() => this.updateUI()}
        container={this.containerElement}
      />
    );
  }

  private handleQuickActionClick = (quickAction: QuickAction) => {
    const actions = [quickAction.action];
    if (!quickAction.letQuickActionsOpen) {
      actions.push(QuickActionUI.hide());
    }
    if (quickAction.removeSelection) {
      actions.push(SelectAllAction.create(false));
    }

    if (this.activeQuickAction === quickAction.title && this.activeMenuAction) {
      this.setActiveQuickAction();
      this.closeMenu();
    } else {
      this.activeMenuAction = undefined;
      this.setActiveQuickAction(quickAction.title);
      this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatchAll(actions));
    }
  };

  private closeMenu() {
    this.activeMenuAction = undefined;
    this.update();
  }

  private setActiveQuickAction(buttonId?: string) {
    this.activeQuickAction = buttonId;
    this.update();
  }

  private loadSingleQuickActions(element: GModelElement) {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.singleQuickAction(element)));
  }

  private loadMultiQuickActions(elements: GModelElement[]) {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.multiQuickAction(elements)));
  }

  private filterQuickActions(quickActions: (QuickAction | undefined)[]) {
    return quickActions.filter(isNotUndefined).filter(quickAction => !this.isReadonly() || quickAction.readonlySupport);
  }

  protected isReadonly(): boolean {
    return this.editorContext.isReadonly;
  }

  static show(contextElementsId?: string[]) {
    return SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: true, contextElementsId });
  }

  static hide(contextElementsId?: string[]) {
    return SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false, contextElementsId });
  }
}

export class QuickActionUiMouseListener extends MouseListener {
  constructor(private quickActionUi: QuickActionUI) {
    super();
  }

  override wheel() {
    this.quickActionUi.showUi();
    return [];
  }
}

function getElements(contextElementIds: string[], root: Readonly<GModelRoot>) {
  return contextElementIds
    .map(id => root.index.getById(id))
    .filter(isNotUndefined)
    .filter(e => !(e instanceof GLabel));
}

function getFirstQuickActionElement(elements: GModelElement[]) {
  return elements.filter(isQuickActionAware)[0];
}
