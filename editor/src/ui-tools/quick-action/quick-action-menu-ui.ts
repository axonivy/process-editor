import { Action, GIssueMarker, type IActionDispatcher, type JsonAny, PaletteItem, SIssue } from '@eclipse-glsp/client';
import { marked } from 'marked';
import { StreamlineIcons } from '../../StreamlineIcons';
import { createElement, createIcon } from '../../utils/ui-utils';
import { ItemMenu, type ShowMenuAction, SimpleMenu } from '../menu/menu';
import { EditColorUi } from './color/edit-color-ui';
import DOMPurify from 'dompurify';

export interface ShowQuickActionMenuAction extends ShowMenuAction {
  kind: typeof ShowQuickActionMenuAction.KIND;
  elementIds: string[];
  actions: (item: PaletteItem, elementIds: string[]) => Action[];
  isEditable?: boolean;
}

export namespace ShowQuickActionMenuAction {
  export const KIND = 'showQuickActionMenu';

  export function create(options: {
    elementIds: string[];
    paletteItems: () => PaletteItem[];
    actions: (item: PaletteItem, elementIds: string[]) => Action[];
    showSearch?: boolean;
    customCssClass?: string;
    isEditable?: boolean;
  }): ShowQuickActionMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function empty(): ShowQuickActionMenuAction {
    return create({
      elementIds: [],
      paletteItems: () => [],
      actions: (item: PaletteItem, elementIds: string[]) => []
    });
  }

  export function is(object: any): object is ShowQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

export class QuickActionMenu extends ItemMenu {
  protected menuCssClass = ['bar-menu', 'quick-action-bar-menu'];
  protected editUi?: EditColorUi;

  constructor(
    readonly actionDispatcher: IActionDispatcher,
    readonly action: ShowQuickActionMenuAction
  ) {
    super(actionDispatcher, action);
  }

  protected appendMenuParts(body: HTMLElement): void {
    if (this.action.isEditable) {
      this.editUi = new EditColorUi(this.actionDispatcher, this.action.elementIds, body);
    }
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }

  protected appendItemToGroup(group: HTMLElement): void {
    if (this.action.isEditable) {
      const button = createElement('div', [ItemMenu.ITEM_BUTTON, 'new-color-btn']);
      button.appendChild(createElement('span', ['new-color-icon', 'si', `si-${StreamlineIcons.Add}`]));
      button.insertAdjacentText('beforeend', 'New Color');
      button.onclick = () => this.editUi?.showEditUi();
      button.onmouseenter = _ev => this.focusButton(button);
      group.appendChild(button);
    }
  }

  toolButtonOnClick(item: PaletteItem): Action[] {
    return this.action.actions(item, this.action.elementIds);
  }

  protected appendToToolButton(button: HTMLElement, item: PaletteItem): void {
    if (this.action.isEditable && item.label !== 'default') {
      button.appendChild(this.createEditButton(item));
    }
  }

  private createEditButton(item: PaletteItem): HTMLElement {
    const editButton = createIcon(['si', `si-${StreamlineIcons.Edit}`, 'color-edit-button']);
    editButton.title = 'Edit Color';
    editButton.onclick = (ev: MouseEvent) => {
      ev.stopPropagation();
      this.editUi?.showEditUi(item);
    };
    return editButton;
  }

  protected appendPaletteIcon(button: HTMLElement, item: PaletteItem): Node {
    if (this.action.isEditable) {
      if (item.icon && item.icon.length > 0) {
        const span = createElement('span', ['color-icon']);
        span.style.backgroundColor = item.icon;
        return span;
      } else {
        return createElement('span', ['empty-icon']);
      }
    }
    return super.appendPaletteIcon(button, item);
  }
}

export interface ShowInfoQuickActionMenuAction extends Action {
  kind: typeof ShowInfoQuickActionMenuAction.KIND;
  elementId: string;
  markers: GIssueMarker[];
  title?: string;
  text?: string;
  info?: JsonAny;
}

export namespace ShowInfoQuickActionMenuAction {
  export const KIND = 'showSimpleQuickActionMenu';

  export function create(options: {
    elementId: string;
    markers: GIssueMarker[];
    title?: string;
    text?: string;
    info?: JsonAny;
  }): ShowInfoQuickActionMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is ShowInfoQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

type InfoFormat = 'CODE' | 'STRING';

export class InfoQuickActionMenu extends SimpleMenu {
  constructor(readonly action: ShowInfoQuickActionMenuAction) {
    super();
  }

  createMenuBody(bodyDiv: HTMLElement): void {
    const menu = createElement('div', ['bar-menu-text']);
    bodyDiv.appendChild(menu);
    if (this.action.title) {
      menu.appendChild(this.createTitle(this.action.title));
    }
    this.action.markers.forEach(marker => menu.appendChild(this.createMarker(marker)));
    if (this.action.text) {
      menu.appendChild(this.createDescription(this.action.text));
    }
    if (this.action.info) {
      for (const [label, info] of Object.entries(this.action.info)) {
        menu.appendChild(this.addInfo(label, info));
      }
    }
    menu.appendChild(this.createInfo('PID', this.action.elementId));
  }

  private addInfo(label: string, info: { type: InfoFormat; value: string }): HTMLElement {
    switch (info.type) {
      case 'STRING':
        return this.createInfo(label, info.value);
      case 'CODE':
        return this.createCodeInfo(label, info.value);
    }
  }

  private createTitle(name: string): HTMLElement {
    const title = createElement('p', ['simple-menu-header']);
    title.textContent = name;
    return title;
  }

  private createCodeInfo(infoLabel: string, infoValue: string): HTMLElement {
    const info = createElement('p', ['simple-menu-text', 'simple-menu-small']);
    const label = createElement('strong');
    label.textContent = `${infoLabel}: `;
    info.prepend(label);
    const value = createElement('pre');
    value.textContent = infoValue;
    info.appendChild(value);
    return info;
  }

  private createInfo(infoLabel: string, infoValue: string): HTMLElement {
    const info = createElement('p', ['simple-menu-text', 'simple-menu-small']);
    const label = createElement('strong');
    info.textContent = infoValue;
    label.textContent = `${infoLabel}: `;
    info.prepend(label);
    return info;
  }

  private createDescription(description: string): HTMLElement {
    const htmlText = DOMPurify.sanitize(marked.parse(description, { async: false, breaks: true }));
    const template = document.createElement('template');
    template.innerHTML = htmlText;
    const text = createElement('div', ['simple-menu-text']);
    for (const child of template.content.childNodes) {
      text.appendChild(child);
    }
    return text;
  }

  private createMarker(gMarker: GIssueMarker): HTMLElement {
    const marker = createElement('div', ['menu-marker']);
    gMarker.issues.forEach(issue => marker.appendChild(this.createIssue(issue)));
    return marker;
  }

  private createIssue(sIssue: SIssue): HTMLElement {
    const issue = createElement('div', ['menu-issue']);
    const issueTitle = createElement('div', ['menu-issue-title']);
    issueTitle.appendChild(createElement('i', ['si', `si-${sIssue.severity}`]));
    const issueTitleSpan = createElement('span');
    issueTitleSpan.textContent = sIssue.severity === 'error' ? 'Error' : 'Caution';
    issueTitle.appendChild(issueTitleSpan);
    issue.appendChild(issueTitle);

    const issueMessage = createElement('p', ['menu-issue-message']);
    issueMessage.textContent = sIssue.message;
    issue.appendChild(issueMessage);
    return issue;
  }
}
