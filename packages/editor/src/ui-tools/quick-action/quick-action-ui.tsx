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
import React, { useRef } from 'react';

import { Edge, EdgeLabel } from '../../diagram/model';
import { IVY_TYPES } from '../../types';
import { getAbsoluteEdgeBounds } from '../../utils/diagram-utils';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import { isQuickActionAware } from './model';
import type { QuickAction, QuickActionLocation, QuickActionProvider } from './quick-action';
import { ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from './quick-action-menu-ui';
import { calculateBarShift, calculateMenuShift } from './quick-action-util';

import { Button, Flex } from '@axonivy/ui-components';
import { QuickActionColorPalette } from './components/QuickActionColorPalette';
import { QuickActionInfoPanel } from './components/QuickActionInfoPanel';
import { QuickActionItemPalette } from './components/QuickActionItemPalette';

@injectable()
export class QuickActionUI extends ReactUIExtension implements IActionHandler, ISelectionListener {
  static readonly ID = 'quickActionsUi';
  private activeQuickActions: QuickAction[] = [];
  private activeQuickActionBtn?: string;
  private activeMenuAction?: ShowQuickActionMenuAction | ShowInfoQuickActionMenuAction;

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(SelectionService) protected selectionService: SelectionService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

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

  protected initializeContents(containerElement: HTMLElement): void {
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
      this.setActiveQuickActionBtn();
    }
  }

  public showUi(): void {
    this.activeQuickActions = [];
    this.activeQuickActionBtn = undefined;
    this.actionDispatcherProvider().then(actionDispatcher =>
      actionDispatcher.dispatch(QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]))
    );
  }

  public hideUi(): void {
    this.activeQuickActions = [];
    this.activeQuickActionBtn = undefined;
    this.activeMenuAction = undefined;
    this.actionDispatcherProvider().then(actionDispatcher => actionDispatcher.dispatch(QuickActionUI.hide()));
  }

  protected render(root: Readonly<GModelRoot>, ...contextElementIds: string[]): React.ReactNode {
    const elements = getElements(contextElementIds, root);
    const elementsWithoutEdges = elements.filter(e => !(e instanceof GRoutableElement) || !(e instanceof Edge));

    if (elementsWithoutEdges.length > 1) {
      return this.renderMultiQuickActionUi(elementsWithoutEdges);
    } else if (elements.length === 1 && elements[0] instanceof GEdge && isQuickActionAware(elements[0])) {
      return this.renderEdgeQuickActionUi(elements[0]);
    } else {
      const element = getFirstQuickActionElement(elementsWithoutEdges);
      return this.renderSingleQuickActionUi(element);
    }
  }

  private renderMultiQuickActionUi(elements: GModelElement[]): React.ReactNode {
    this.activeQuickActions = this.loadMultiQuickActions(elements);
    if (this.activeQuickActions.length === 0) {
      return null;
    }

    // skip edge labels as they have bounds that do not actually match their rendering
    const selectionBounds = elements
      .filter(element => !(element instanceof EdgeLabel))
      .map(getAbsoluteBounds)
      .filter(Bounds.isValid)
      .reduce(Bounds.combine);

    return (
      <QuickActionContainer bounds={selectionBounds} drawSelectionBox={true}>
        {barRef => (
          <>
            <QuickActionBar
              quickActions={this.activeQuickActions}
              activeActionId={this.activeQuickActionBtn}
              onQuickActionClick={this.handleQuickActionClick}
              barRef={barRef}
            />
            {this.renderActiveMenu(barRef)}
          </>
        )}
      </QuickActionContainer>
    );
  }

  private renderSingleQuickActionUi(element: GModelElement & BoundsAware): React.ReactNode {
    if (isNotUndefined(element)) {
      this.activeQuickActions = this.loadSingleQuickActions(element);
      if (this.activeQuickActions.length === 0) {
        return null;
      }
      const bounds = getAbsoluteBounds(element);
      return (
        <QuickActionContainer bounds={bounds}>
          {barRef => (
            <>
              <QuickActionBar
                quickActions={this.activeQuickActions}
                activeActionId={this.activeQuickActionBtn}
                onQuickActionClick={this.handleQuickActionClick}
                barRef={barRef}
              />
              {this.renderActiveMenu(barRef)}
            </>
          )}
        </QuickActionContainer>
      );
    }
    return null;
  }

  private renderEdgeQuickActionUi(edge: GEdge): React.ReactNode {
    if (isNotUndefined(edge) && !edge.id.endsWith('_feedback_edge') && edge.source && edge.target) {
      this.activeQuickActions = this.loadSingleQuickActions(edge);
      if (this.activeQuickActions.length === 0) {
        return null;
      }
      const absoluteBounds = getAbsoluteEdgeBounds(edge);
      return (
        <QuickActionContainer bounds={absoluteBounds}>
          {barRef => (
            <>
              <QuickActionBar
                quickActions={this.activeQuickActions}
                activeActionId={this.activeQuickActionBtn}
                onQuickActionClick={this.handleQuickActionClick}
                barRef={barRef}
              />
              {this.renderActiveMenu(barRef)}
            </>
          )}
        </QuickActionContainer>
      );
    }
    return null;
  }

  private renderActiveMenu(barRef?: React.RefObject<HTMLDivElement>): React.ReactNode {
    if (!this.activeMenuAction) {
      return null;
    }

    if (ShowQuickActionMenuAction.is(this.activeMenuAction)) {
      return this.activeMenuAction.isEditable ? (
        <QuickActionColorPalette
          action={this.activeMenuAction}
          actionDispatcher={this.actionDispatcherProvider}
          anchor={barRef}
          onClose={() => this.closeMenu()}
        />
      ) : (
        <QuickActionItemPalette
          action={this.activeMenuAction}
          actionDispatcher={this.actionDispatcherProvider}
          anchor={barRef}
          onClose={() => this.closeMenu()}
        />
      );
    }

    if (ShowInfoQuickActionMenuAction.is(this.activeMenuAction) && barRef) {
      return <QuickActionInfoPanel action={this.activeMenuAction} anchor={barRef} onClose={() => this.closeMenu()} />;
    }

    return null;
  }

  private handleQuickActionClick = (quickAction: QuickAction, buttonId: string): void => {
    const actions = [quickAction.action];
    if (!quickAction.letQuickActionsOpen) {
      actions.push(QuickActionUI.hide());
    }
    if (quickAction.removeSelection) {
      actions.push(SelectAllAction.create(false));
    }

    if (this.activeQuickActionBtn === buttonId && this.activeMenuAction) {
      this.setActiveQuickActionBtn();
      this.closeMenu();
    } else {
      this.setActiveQuickActionBtn(buttonId);
      this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatchAll(actions));
    }
  };

  private closeMenu(): void {
    this.activeMenuAction = undefined;
    this.update();
  }

  private setActiveQuickActionBtn(buttonId?: string): void {
    this.activeQuickActionBtn = buttonId;
    this.update();
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

  // Static methods for positioning (preserved from original)
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
}

interface QuickActionContainerProps {
  bounds: Bounds;
  drawSelectionBox?: boolean;
  children: React.ReactNode | ((barRef: React.RefObject<HTMLDivElement>) => React.ReactNode);
}

const QuickActionContainer: React.FC<QuickActionContainerProps> = ({ bounds, drawSelectionBox, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.left = `${bounds.x + bounds.width / 2}px`;
      containerRef.current.style.top = `${bounds.y + bounds.height}px`;
    }
  }, [bounds]);

  return (
    <div ref={containerRef} style={{ position: 'absolute' }}>
      {drawSelectionBox && (
        <div
          className='multi-selection-box'
          style={{
            marginLeft: `-${bounds.width / 2}px`,
            marginTop: `-${bounds.height}px`,
            height: `${bounds.height + 10}px`,
            width: `${bounds.width + 10}px`
          }}
        />
      )}
      {typeof children === 'function' ? children(barRef as React.RefObject<HTMLDivElement>) : children}
    </div>
  );
};

interface QuickActionBarProps {
  quickActions: QuickAction[];
  activeActionId?: string;
  onQuickActionClick: (quickAction: QuickAction, buttonId: string) => void;
  barRef?: React.RefObject<HTMLDivElement | null>;
}

const QuickActionBar: React.FC<QuickActionBarProps> = ({ quickActions, activeActionId, onQuickActionClick, barRef }) => {
  const internalBarRef = useRef<HTMLDivElement>(null);
  const actualBarRef = barRef || internalBarRef;

  React.useEffect(() => {
    if (actualBarRef?.current) {
      const diagramDiv = document.querySelector('.sprotty') as HTMLElement;
      QuickActionUI.shiftBar(actualBarRef.current, diagramDiv);
    }
  });

  const renderQuickActionGroup = (location: QuickActionLocation) => {
    const actionsForLocation = quickActions
      .filter(quickAction => quickAction.location === location)
      .sort((a, b) => a.sorting.localeCompare(b.sorting));

    if (actionsForLocation.length === 0) {
      return null;
    }

    return (
      <Flex className='quick-actions-group' gap={1}>
        {actionsForLocation.map(quickAction => (
          <Button
            key={quickAction.title}
            icon={quickAction.icon}
            size='large'
            toggle={activeActionId === quickAction.title}
            title={quickAction.title}
            aria-label={quickAction.title}
            onClick={() => onQuickActionClick(quickAction, quickAction.title)}
          />
        ))}
      </Flex>
    );
  };

  return (
    <Flex ref={barRef} className='quick-actions-bar' gap={4}>
      {renderQuickActionGroup('Left')}
      {renderQuickActionGroup('Middle')}
      {renderQuickActionGroup('Right')}
    </Flex>
  );
};

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
