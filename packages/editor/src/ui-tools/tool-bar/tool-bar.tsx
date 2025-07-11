import { UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import { Button, Flex, PaletteButton, PaletteButtonLabel, Separator, Toolbar, ToolbarContainer } from '@axonivy/ui-components';
import {
  Action,
  DisposableCollection,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  type IActionDispatcher,
  type IActionHandler,
  type IEditModeListener,
  ISelectionListener,
  MouseListener,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  isNotUndefined
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import React from 'react';
import { SModelRootImpl } from 'sprotty';
import { IVY_TYPES } from '../../types';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import type { Menu } from '../menu/menu';
import {
  DefaultSelectButton,
  MarqueeToolButton,
  type ToolBarButton,
  ToolBarButtonLocation,
  type ToolBarButtonProvider,
  compareButtons
} from './button';
import { EditButtons } from './edit-buttons';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { ToolBarOptionsMenu } from './options/options-menu-ui';
import { ShowToolBarMenuAction, ToolBarMenu } from './tool-bar-menu';

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
  protected lastMenuAction?: string;
  protected toolBarMenu?: Menu;

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

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRootImpl>, ...contextElementIds: string[]): void {
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
            <ToolbarContainer maxWidth={450}>
              <Flex>
                <Separator orientation='vertical' style={{ height: '26px' }} />
                <EditButtons root={this.editorContext.modelRoot} dispatcher={this.actionDispatcher} />
              </Flex>
            </ToolbarContainer>
          )}
        </Flex>
        <Flex className='middle-buttons' gap={3}>
          {middle.map(btn => this.renderToolbarButton(btn, activeButtonId))}
        </Flex>
        <Flex className='right-buttons' gap={1}>
          {right.map(btn => this.renderToolbarButton(btn, activeButtonId))}
        </Flex>
      </Toolbar>
    );
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
    if (!button.showTitle) {
      return (
        <Button
          key={button.id}
          id={button.id}
          toggle={activeButtonId === button.id}
          size='large'
          title={button.title}
          aria-label={button.title}
          icon={button.icon}
          onClick={evt => this.handleToolbarButtonClicked({ source: button, reference: evt.currentTarget })}
        />
      );
    }
    return (
      <PaletteButtonLabel key={button.id} label={button.title}>
        <PaletteButton
          id={button.id}
          toggle={activeButtonId === button.id}
          icon={button.icon}
          label={button.title}
          onClick={evt => this.handleToolbarButtonClicked({ source: button, reference: evt.currentTarget })}
        />
      </PaletteButtonLabel>
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
    if (items.length !== 0 && action.id !== this.lastMenuAction) {
      this.toolBarMenu = new ToolBarMenu(this.actionDispatcher, action, items);
      const menu = this.toolBarMenu.create(this.containerElement);
      if (this.lastButtonClickEvent?.reference) {
        const menuRight = menu.offsetLeft + menu.offsetWidth;
        const buttonCenter = this.lastButtonClickEvent.reference.offsetLeft + this.lastButtonClickEvent.reference.offsetWidth / 2;
        menu.style.setProperty('--menu-arrow-pos', `${menuRight - buttonCenter - 6}px`);
      }
      this.setLastMenuAction(action.id);
    } else {
      this.changeActiveButton();
      this.setLastMenuAction(undefined);
      // Reset focus to diagram
      document.getElementById(this.options.baseDiv)?.querySelector<HTMLDivElement>('div[tabindex]')?.focus();
    }
  }

  toggleOptionsMenu(action: ShowToolBarOptionsMenuAction): void {
    if (action.id !== this.lastMenuAction) {
      this.toolBarMenu = new ToolBarOptionsMenu(this.actionDispatcher, action);
      this.toolBarMenu.create(this.containerElement);
      this.setLastMenuAction(action.id);
    } else {
      this.changeActiveButton();
      this.setLastMenuAction(undefined);
    }
  }

  setLastMenuAction(id?: string): void {
    this.lastMenuAction = id;
  }

  changeActiveButton(evt?: ToolBarButtonClickEvent): void {
    this.lastButtonClickEvent = evt;
    this.hideMenus();
    this.update();
  }

  hideMenus(): void {
    this.toolBarMenu?.remove();
    this.toolBarMenu = undefined;
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
    this.toolBar.setLastMenuAction();
    return [];
  }
}
