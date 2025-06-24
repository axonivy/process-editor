import {
  Action,
  Bounds,
  type BoundsAware,
  CursorCSS,
  EditorContextService,
  GEdge,
  GLSPAbstractUIExtension,
  GLSPMouseTool,
  GLabel,
  GModelElement,
  GModelRoot,
  GRoutableElement,
  type IActionDispatcherProvider,
  type IActionHandler,
  ISelectionListener,
  MouseListener,
  PaletteItem,
  RemoveMarqueeAction,
  SelectAllAction,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  getAbsoluteBounds,
  isNotUndefined
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import { createElement, createIcon } from '../../utils/ui-utils';

import { Edge, EdgeLabel } from '../../diagram/model';
import { IVY_TYPES } from '../../types';
import { getAbsoluteEdgeBounds } from '../../utils/diagram-utils';
import type { Menu } from '../menu/menu';
import { isQuickActionAware } from './model';
import type { QuickAction, QuickActionLocation, QuickActionProvider } from './quick-action';
import { InfoQuickActionMenu, QuickActionMenu, ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from './quick-action-menu-ui';
import { calculateBarShift, calculateMenuShift } from './quick-action-util';

@injectable()
export class QuickActionUI extends GLSPAbstractUIExtension implements IActionHandler, ISelectionListener {
  static readonly ID = 'quickActionsUi';
  private activeQuickActions: QuickAction[] = [];
  private activeQuickActionBtn?: HTMLElement;
  private quickActionBar?: HTMLElement;
  private quickActionMenu?: Menu;
  private resizeObserver?: ResizeObserver;

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(SelectionService) protected selectionService: SelectionService;
  @inject(GLSPMouseTool) protected mouseTool: GLSPMouseTool;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  public id(): string {
    return QuickActionUI.ID;
  }

  @postConstruct()
  protected init(): void {
    this.selectionService.onSelectionChanged(event => this.selectionChanged(event.root, event.selectedElements));
    this.mouseTool.register(new QuickActionUiMouseListener(this));
    this.resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 1 && entries[0].target instanceof HTMLElement) {
        QuickActionUI.shiftMenu(entries[0].target, this.quickActionBar);
      }
    });
  }

  public containerClass(): string {
    return 'quick-actions-container';
  }

  public getActiveQuickActions(): QuickAction[] {
    return this.activeQuickActions;
  }

  protected initializeContents(containerElement: HTMLElement): void {
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
    this.removeMenu();
    this.quickActionMenu = new InfoQuickActionMenu(action);
    this.createMenu(this.quickActionMenu);
  }

  private async showItemMenu(action: ShowQuickActionMenuAction): Promise<void> {
    this.removeMenu();
    if (action.elementIds.length > 0) {
      this.quickActionMenu = new QuickActionMenu(
        await this.actionDispatcherProvider(),
        action,
        action.paletteItems() as Array<PaletteItem>
      );
      this.createMenu(this.quickActionMenu);
    } else {
      this.setActiveQuickActionBtn();
    }
  }

  private createMenu(quickActionMenu: Menu): void {
    if (this.quickActionBar) {
      const menu = quickActionMenu.create(this.containerElement);
      if (menu.offsetWidth > this.quickActionBar.offsetWidth) {
        menu.classList.add('border-radius');
        this.quickActionBar.classList.add('no-bottom-border-radius');
        QuickActionUI.shiftBar(menu, this.getParentContainer(), 8);
      } else {
        QuickActionUI.shiftBar(menu, this.getParentContainer(), 24);
      }
      QuickActionUI.shiftMenu(menu, this.quickActionBar);
      this.resizeObserver?.observe(menu);
    }
  }

  private removeMenu(): void {
    this.quickActionMenu?.remove();
    this.quickActionMenu = undefined;
    this.resizeObserver?.disconnect();
  }

  public showUi(): void {
    this.activeQuickActions = [];
    this.actionDispatcherProvider().then(actionDispatcher =>
      actionDispatcher.dispatch(QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]))
    );
  }

  public hideUi(): void {
    this.activeQuickActions = [];
    this.actionDispatcherProvider().then(actionDispatcher => actionDispatcher.dispatch(QuickActionUI.hide()));
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    containerElement.innerHTML = '';
    const elements = getElements(contextElementIds, root);
    const elementsWithoutEdges = elements.filter(e => !(e instanceof GRoutableElement) || !(e instanceof Edge));
    if (elementsWithoutEdges.length > 1) {
      this.showMultiQuickActionUi(containerElement, elementsWithoutEdges);
    } else if (elements.length === 1 && elements[0] instanceof GEdge && isQuickActionAware(elements[0])) {
      this.showEdgeQuickActionUi(containerElement, elements[0]);
    } else {
      const element = getFirstQuickActionElement(elementsWithoutEdges);
      this.showSingleQuickActionUi(containerElement, element);
    }
  }

  private showMultiQuickActionUi(containerElement: HTMLElement, elements: GModelElement[]): void {
    this.activeQuickActions = this.loadMultiQuickActions(elements);
    if (this.activeQuickActions.length === 0) {
      return;
    }

    // skip edge labels as they have bounds that do not actually match their rendering
    const selectionBounds = elements
      .filter(element => !(element instanceof EdgeLabel))
      .map(getAbsoluteBounds)
      .filter(Bounds.isValid)
      .reduce(Bounds.combine);
    this.quickActionBar = this.createQuickActionsBar(containerElement, selectionBounds, true);
    this.createQuickActions(this.quickActionBar, this.activeQuickActions);
    QuickActionUI.shiftBar(this.quickActionBar, this.getParentContainer());
  }

  private showSingleQuickActionUi(containerElement: HTMLElement, element: GModelElement & BoundsAware): void {
    if (isNotUndefined(element)) {
      this.activeQuickActions = this.loadSingleQuickActions(element);
      if (this.activeQuickActions.length === 0) {
        return;
      }
      this.quickActionBar = this.createQuickActionsBar(containerElement, getAbsoluteBounds(element));
      this.createQuickActions(this.quickActionBar, this.activeQuickActions);
      QuickActionUI.shiftBar(this.quickActionBar, this.getParentContainer());
    }
  }

  private showEdgeQuickActionUi(containerElement: HTMLElement, edge: GEdge): void {
    if (isNotUndefined(edge) && !edge.id.endsWith('_feedback_edge') && edge.source && edge.target) {
      this.activeQuickActions = this.loadSingleQuickActions(edge);
      if (this.activeQuickActions.length === 0) {
        return;
      }
      const absoluteBounds = getAbsoluteEdgeBounds(edge);
      this.quickActionBar = this.createQuickActionsBar(containerElement, absoluteBounds);
      this.createQuickActions(this.quickActionBar, this.activeQuickActions);
      QuickActionUI.shiftBar(this.quickActionBar, this.getParentContainer());
    }
  }

  static shiftBar(bar: HTMLElement, diagramDiv: HTMLElement | null, distanceToWindow = 16): void {
    if (diagramDiv === null) {
      return;
    }
    const shift = calculateBarShift(
      bar.getBoundingClientRect(),
      { width: diagramDiv.offsetWidth, height: diagramDiv.offsetHeight },
      distanceToWindow
    );
    bar.style.left = `${shift.left}px`;
    bar.style.top = `${shift.top}px`;
  }

  static shiftMenu(menu: HTMLElement, bar?: HTMLElement): void {
    if (!bar) {
      return;
    }
    const shift = calculateMenuShift(
      { height: menu.getBoundingClientRect().height, y: menu.offsetTop },
      { height: bar?.getBoundingClientRect().height, y: bar.offsetTop }
    );
    if (shift) {
      menu.style.top = `${shift.top}px`;
    }
  }

  private createQuickActionsBar(containerElement: HTMLElement, parentBounds: Bounds, drawSelectionBox = false): HTMLElement {
    containerElement.style.left = `${parentBounds.x + parentBounds.width / 2}px`;
    containerElement.style.top = `${parentBounds.y + parentBounds.height}px`;
    if (drawSelectionBox) {
      const selectionDiv = createElement('div', ['multi-selection-box']);
      selectionDiv.style.marginLeft = `-${parentBounds.width / 2}px`;
      selectionDiv.style.marginTop = `-${parentBounds.height}px`;
      selectionDiv.style.height = `${parentBounds.height + 10}px`;
      selectionDiv.style.width = `${parentBounds.width + 10}px`;
      containerElement.appendChild(selectionDiv);
    }
    const bar = createElement('div', ['quick-actions-bar']);
    containerElement.appendChild(bar);
    return bar;
  }

  private createQuickActions(bar: HTMLElement, quickActions: QuickAction[]): void {
    this.createQuickActionGroup(bar, quickActions, 'Left');
    this.createQuickActionGroup(bar, quickActions, 'Middle');
    this.createQuickActionGroup(bar, quickActions, 'Right');
    this.setContainerVisible(true);
  }

  private createQuickActionGroup(bar: HTMLElement, quickActions: QuickAction[], location: QuickActionLocation): void {
    const group = createElement('div', ['quick-actions-group']);
    quickActions
      .filter(quickAction => quickAction.location === location)
      .sort((a, b) => a.sorting.localeCompare(b.sorting))
      .forEach(quickAction => {
        group.appendChild(this.createQuickActionBtn(quickAction));
      });
    if (group.children.length > 0) {
      bar.appendChild(group);
    }
  }

  private createQuickActionBtn(quickAction: QuickAction): HTMLElement {
    const button = createElement('button');
    button.appendChild(createIcon(quickAction.icon));
    button.title = quickAction.title;
    const actions = [quickAction.action];
    if (!quickAction.letQuickActionsOpen) {
      actions.push(QuickActionUI.hide());
    }
    if (quickAction.removeSelection) {
      actions.push(SelectAllAction.create(false));
    }
    button.onclick = () => this.triggerQuickActionBtn(button, actions);
    return button;
  }

  private triggerQuickActionBtn(button: HTMLElement, actions: Action[]): void {
    if (this.activeQuickActionBtn === button && this.quickActionMenu) {
      this.setActiveQuickActionBtn();
      this.removeMenu();
    } else {
      this.setActiveQuickActionBtn(button);
      this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatchAll(actions));
    }
  }

  private setActiveQuickActionBtn(button?: HTMLElement): void {
    this.activeQuickActionBtn?.classList.remove('active');
    this.activeQuickActionBtn = button;
    this.activeQuickActionBtn?.classList.add('active');
  }

  private loadSingleQuickActions(element: GModelElement): QuickAction[] {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.singleQuickAction(element)));
  }

  private loadMultiQuickActions(elements: GModelElement[]): QuickAction[] {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.multiQuickAction(elements)));
  }

  private filterQuickActions(quickActions: (QuickAction | undefined)[]): QuickAction[] {
    return quickActions.filter(isNotUndefined).filter(quickAction => !this.isReadonly() || quickAction.readonlySupport);
  }

  protected isReadonly(): boolean {
    return this.editorContext.isReadonly;
  }

  static show(contextElementsId?: string[]): SetUIExtensionVisibilityAction {
    return SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: true, contextElementsId });
  }

  static hide(contextElementsId?: string[]): SetUIExtensionVisibilityAction {
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

function getElements(contextElementIds: string[], root: Readonly<GModelRoot>): GModelElement[] {
  return contextElementIds
    .map(id => root.index.getById(id))
    .filter(isNotUndefined)
    .filter(e => !(e instanceof GLabel));
}

function getFirstQuickActionElement(elements: GModelElement[]): GModelElement & BoundsAware {
  return elements.filter(isQuickActionAware)[0];
}
