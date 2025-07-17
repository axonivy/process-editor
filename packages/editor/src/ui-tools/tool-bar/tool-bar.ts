import {
  GLSPAbstractUIExtension,
  Action,
  DisposableCollection,
  EditorContextService,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  type IActionHandler,
  type IEditModeListener,
  ISelectionListener,
  MouseListener,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  isNotUndefined,
  type IActionDispatcher,
  GArgument
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';

import { IvyIcons } from '@axonivy/ui-icons';
import { IVY_TYPES } from '../../types';
import { createElement, createIcon } from '../../utils/ui-utils';
import type { Menu } from '../menu/menu';
import {
  DefaultSelectButton,
  MarqueeToolButton,
  RedoToolButton,
  type ToolBarButton,
  ToolBarButtonLocation,
  type ToolBarButtonProvider,
  UndoToolButton,
  compareButtons
} from './button';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { ToolBarOptionsMenu } from './options/options-menu-ui';
import { ShowToolBarMenuAction, ToolBarMenu } from './tool-bar-menu';
import { UpdatePaletteItems } from '@axonivy/process-editor-protocol';

const CLICKED_CSS_CLASS = 'clicked';

@injectable()
export class ToolBar extends GLSPAbstractUIExtension implements IActionHandler, IEditModeListener, ISelectionListener {
  static readonly ID = 'ivy-tool-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(SelectionService) protected readonly selectionService: SelectionService;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @multiInject(IVY_TYPES.ToolBarButtonProvider) protected toolBarButtonProvider: ToolBarButtonProvider[];

  protected lastActivebutton?: HTMLElement;
  protected defaultToolsButton?: HTMLElement;
  protected toggleCustomIconsButton: HTMLElement;
  protected verticalAlignButton: HTMLElement;
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
    this.toDisposeOnDisable.push(
      this.editorContext.onModelRootChanged(() => {
        if (!this.lastMenuAction) {
          this.createHeader();
        }
      })
    );
  }

  containerClass() {
    return ToolBar.ID;
  }

  protected initializeContents(containerElement: HTMLElement) {
    this.createHeader();
    this.lastActivebutton = this.defaultToolsButton;
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected onBeforeShow() {
    this.toDisposeOnHide.push(this.selectionService.onSelectionChanged(() => this.selectionChanged()));
  }

  hide() {
    super.hide();
    this.toDisposeOnHide.dispose();
  }

  protected createHeader(): void {
    const headerCompartment = createElement('div', ['tool-bar-header']);
    headerCompartment.appendChild(this.createLeftButtons());
    headerCompartment.appendChild(this.createMiddleButtons());
    headerCompartment.appendChild(this.createRightButtons());
    this.containerElement.innerHTML = '';
    this.containerElement.appendChild(headerCompartment);
    this.changeActiveButton();
  }

  private createLeftButtons(): HTMLElement {
    const leftButtons = createElement('div', ['left-buttons']);

    this.defaultToolsButton = this.createToolButton(DefaultSelectButton);
    leftButtons.appendChild(this.defaultToolsButton);
    leftButtons.appendChild(this.createToolButton(MarqueeToolButton));

    if (!this.editorContext.isReadonly) {
      const editPart = createElement('div', ['edit-buttons']);
      const undoBtn = this.createToolButton(UndoToolButton);
      this.disableEditButton(undoBtn, 'canUndo');
      editPart.appendChild(undoBtn);
      const redoBtn = this.createToolButton(RedoToolButton);
      this.disableEditButton(redoBtn, 'canRedo');
      editPart.appendChild(redoBtn);
      leftButtons.appendChild(editPart);
    }
    return leftButtons;
  }

  private disableEditButton(button: HTMLElement, argument: 'canUndo' | 'canRedo'): void {
    if (button instanceof HTMLButtonElement) {
      button.disabled = GArgument.getArgument(this.editorContext.modelRoot, argument) !== true;
    }
  }

  private createMiddleButtons(): HTMLElement {
    const middleButtons = createElement('div', ['middle-buttons']);
    this.appendProvidedButtons(middleButtons, ToolBarButtonLocation.Middle);
    return middleButtons;
  }

  private createRightButtons(): HTMLElement {
    const rightButtons = createElement('div', ['right-buttons']);
    this.appendProvidedButtons(rightButtons, ToolBarButtonLocation.Right);
    return rightButtons;
  }

  private appendProvidedButtons(parent: HTMLElement, location: ToolBarButtonLocation): void {
    this.toolBarButtonProvider
      .map(provider => provider.button())
      .filter(isNotUndefined)
      .filter(button => button.location === location)
      .filter(button => !this.editorContext.isReadonly || button.readonly)
      .sort(compareButtons)
      .forEach(button => parent.appendChild(this.createToolButton(button)));
  }

  private createToolButton(toolBarButton: ToolBarButton): HTMLElement {
    const button = createElement('button', ['tool-bar-button']);
    button.appendChild(createIcon(toolBarButton.icon));
    button.title = toolBarButton.title;
    if (toolBarButton.id) {
      button.id = toolBarButton.id;
    }
    button.onclick = () => {
      this.actionDispatcher.dispatch(toolBarButton.action());
      if (toolBarButton.switchFocus) {
        this.changeActiveButton(button);
      }
    };
    return this.createTitleToolButton(button, toolBarButton);
  }

  public createTitleToolButton(button: HTMLElement, toolBarButton: ToolBarButton): HTMLElement {
    if (toolBarButton.showTitle) {
      const titleButton = createElement('span', ['tool-bar-title-button']);
      const title = document.createElement('label');
      title.textContent = toolBarButton.title;
      if (!toolBarButton.isNotMenu) {
        button.appendChild(createIcon(IvyIcons.Chevron));
      }
      titleButton.appendChild(title);
      titleButton.appendChild(button);
      return titleButton;
    }
    return button;
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
        this.createHeader();
      }
    }
    return;
  }

  async toggleToolBarMenu(action: ShowToolBarMenuAction): Promise<void> {
    const items = await action.paletteItems();
    if (items.length !== 0 && action.id !== this.lastMenuAction) {
      this.toolBarMenu = new ToolBarMenu(this.actionDispatcher, action, items);
      const menu = this.toolBarMenu.create(this.containerElement);
      if (this.lastActivebutton) {
        const menuRight = menu.offsetLeft + menu.offsetWidth;
        const buttonCenter = this.lastActivebutton.offsetLeft + this.lastActivebutton.offsetWidth / 2;
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

  changeActiveButton(button?: HTMLElement): void {
    this.lastActivebutton?.classList.remove(CLICKED_CSS_CLASS);
    let activeButton = this.defaultToolsButton;
    if (button) {
      activeButton = button;
    }
    activeButton?.classList.add(CLICKED_CSS_CLASS);
    this.lastActivebutton = activeButton;
    this.hideMenus();
  }

  hideMenus(): void {
    this.toolBarMenu?.remove();
    this.toolBarMenu = undefined;
  }

  editModeChanged(): void {
    if (this.containerElement) {
      this.createHeader();
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
