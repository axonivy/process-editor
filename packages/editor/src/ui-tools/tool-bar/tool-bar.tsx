import { UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import { Flex, Popover, PopoverAnchor, PopoverArrow, PopoverContent, Toolbar } from '@axonivy/ui-components';
import {
  Action,
  DisposableCollection,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  GModelRoot,
  type IActionDispatcher,
  type IActionHandler,
  type IEditModeListener,
  ISelectionListener,
  MouseListener,
  type PaletteItem,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  isNotUndefined
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import React from 'react';
import { IVY_TYPES } from '../../types';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import {
  DefaultSelectButton,
  MarqueeToolButton,
  type ToolBarButton,
  ToolBarButtonLocation,
  type ToolBarButtonProvider,
  compareButtons
} from './button';
import { ToolBarButton as ToolBarButtonComponent } from './components/ToolBarButton';
import { ToolBarOptionsMenu } from './components/ToolBarOptionsMenu';
import { ToolBarPaletteMenu } from './components/ToolBarPaletteMenu';
import { UndoRedoButtons } from './components/UndoRedoButtons';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { ShowToolBarMenuAction } from './tool-bar-menu';

export type ToolBarButtonClickEvent = {
  source: ToolBarButton;
  reference?: HTMLButtonElement;
};

@injectable()
export class ToolBar extends ReactUIExtension implements IActionHandler, IEditModeListener, ISelectionListener {
  static readonly ID = 'ivy-tool-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(SelectionService) protected readonly selectionService: SelectionService;
  @multiInject(IVY_TYPES.ToolBarButtonProvider) protected toolBarButtonProvider: ToolBarButtonProvider[];

  protected lastButtonClickEvent?: ToolBarButtonClickEvent;
  protected activeMenuAction?: ShowToolBarMenuAction | ShowToolBarOptionsMenuAction;
  protected loadedPaletteItems?: PaletteItem[];

  protected toDisposeOnDisable = new DisposableCollection();
  protected toDisposeOnHide = new DisposableCollection();

  id(): string {
    return ToolBar.ID;
  }

  @postConstruct()
  protected init() {
    this.toDisposeOnDisable.push(this.editorContext.onEditModeChanged(() => this.editModeChanged()));
    this.toDisposeOnDisable.push(this.editorContext.onModelRootChanged(() => this.update()));
  }

  containerClass() {
    return ToolBar.ID;
  }

  protected initializeContents(containerElement: HTMLElement) {
    super.initializeContents(containerElement);
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    super.onBeforeShow(containerElement, root, ...contextElementIds);
    this.toDisposeOnHide.push(this.selectionService.onSelectionChanged(() => this.selectionChanged()));
  }

  hide() {
    super.hide();
    this.toDisposeOnHide.dispose();
  }

  protected render(): React.ReactNode {
    const left = [DefaultSelectButton(), MarqueeToolButton(), ...this.getProvidedToolBarButtons(ToolBarButtonLocation.Left)];
    const middle = this.getProvidedToolBarButtons(ToolBarButtonLocation.Middle);
    const right = this.getProvidedToolBarButtons(ToolBarButtonLocation.Right);
    const activeButtonId = this.lastButtonClickEvent?.source.id ?? DefaultSelectButton().id;
    return (
      <Toolbar className='tool-bar-header'>
        <Flex className='left-buttons'>
          <Flex gap={1}>{left.map(btn => this.renderToolbarButton(btn, activeButtonId))}</Flex>
          {!this.editorContext.isReadonly && (
            <UndoRedoButtons actionDispatcher={this.actionDispatcher} modelRoot={this.editorContext.modelRoot} />
          )}
        </Flex>
        <Flex className='middle-buttons' gap={3}>
          {middle.map(btn => this.renderToolbarButton(btn, activeButtonId))}
        </Flex>
        <Flex className='right-buttons' gap={1}>
          {right.map(btn => this.renderToolbarButton(btn, activeButtonId))}
        </Flex>

        {/* Dynamic popover for menu items and options */}
        <Popover open={!!this.activeMenuAction}>
          <PopoverAnchor
            style={{ display: 'none' }}
            virtualRef={this.lastButtonClickEvent?.reference ? { current: this.lastButtonClickEvent.reference } : undefined}
          />
          {this.renderActiveMenu()}
        </Popover>
      </Toolbar>
    );
  }

  private renderActiveMenu(): React.ReactNode {
    if (!this.activeMenuAction) {
      return null;
    }

    if (ShowToolBarMenuAction.is(this.activeMenuAction)) {
      return (
        <ToolBarPaletteMenu
          paletteItems={this.loadedPaletteItems || []}
          menuAction={this.activeMenuAction}
          actionDispatcher={this.actionDispatcher}
        />
      );
    }

    if (ShowToolBarOptionsMenuAction.is(this.activeMenuAction)) {
      return (
        <PopoverContent className={'tool-bar-options-content'} sideOffset={8} collisionPadding={4}>
          <PopoverArrow />
          <ToolBarOptionsMenu action={this.activeMenuAction} actionDispatcher={this.actionDispatcher} />
        </PopoverContent>
      );
    }

    return null;
  }

  protected getProvidedToolBarButtons(location: ToolBarButtonLocation): ToolBarButton[] {
    return this.toolBarButtonProvider
      .map(provider => provider.button())
      .filter(isNotUndefined)
      .filter(button => button.location === location)
      .filter(button => !this.editorContext.isReadonly || button.readonly)
      .sort(compareButtons);
  }

  protected renderToolbarButton(button: ToolBarButton, activeButtonId: string): React.ReactNode {
    return (
      <ToolBarButtonComponent
        key={button.id}
        button={button}
        isActive={activeButtonId === button.id}
        onClick={evt => this.handleToolbarButtonClicked({ source: button, reference: evt.currentTarget })}
      />
    );
  }

  protected handleToolbarButtonClicked(evt: ToolBarButtonClickEvent): void {
    this.actionDispatcher.dispatch(evt.source.action());
    if (evt.source.switchFocus) {
      this.changeActiveButton(evt);
    }
  }

  handle(action: Action) {
    if (EnableToolPaletteAction.is(action)) {
      return SetUIExtensionVisibilityAction.create({ extensionId: ToolBar.ID, visible: true });
    }
    if (EnableDefaultToolsAction.is(action)) {
      this.changeActiveButton();
      this.restoreFocus();
    }
    if (ShowToolBarOptionsMenuAction.is(action)) {
      this.toggleOptionsMenu(action);
    }
    if (ShowToolBarMenuAction.is(action)) {
      this.toggleToolBarMenu(action);
    }
    if (UpdatePaletteItems.is(action)) {
      if (this.containerElement) {
        this.update();
      }
    }
    return;
  }

  async toggleToolBarMenu(action: ShowToolBarMenuAction): Promise<void> {
    const items = await action.paletteItems();
    if (items.length !== 0 && action.id !== this.activeMenuAction?.id) {
      this.activeMenuAction = action;
      this.loadedPaletteItems = items;
    } else {
      this.closeMenu();
      // Reset focus to diagram
      document.getElementById(this.options.baseDiv)?.querySelector<HTMLDivElement>('div[tabindex]')?.focus();
    }
    this.update();
  }

  toggleOptionsMenu(action: ShowToolBarOptionsMenuAction): void {
    if (action.id !== this.activeMenuAction?.id) {
      this.activeMenuAction = action;
      this.loadedPaletteItems = undefined;
    } else {
      this.closeMenu();
    }
    this.update();
  }

  private closeMenu(): void {
    this.lastButtonClickEvent = undefined;
    this.activeMenuAction = undefined;
    this.loadedPaletteItems = undefined;
  }

  changeActiveButton(evt?: ToolBarButtonClickEvent): void {
    this.lastButtonClickEvent = evt;
    if (this.lastButtonClickEvent === undefined || this.lastButtonClickEvent?.reference !== evt?.reference) {
      this.closeMenu();
    }
    this.update();
  }

  editModeChanged(): void {
    if (this.isContainerVisible()) {
      this.changeActiveButton();
    }
  }

  selectionChanged(): void {
    // placeholder
  }

  disable(): void {
    this.toDisposeOnDisable.dispose();
  }
}

@injectable()
export class ToolBarFocusMouseListener extends MouseListener {
  constructor(@inject(ToolBar) private readonly toolBar: ToolBar) {
    super();
  }

  mouseDown(): Action[] {
    this.toolBar.changeActiveButton();
    return [];
  }
}
