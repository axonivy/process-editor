import { IvyIcons } from '@axonivy/ui-icons';
import type { GIssue, GIssueMarker, GIssueSeverity, IActionDispatcher, JsonAny, PaletteItem } from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { marked } from 'marked';
import { createElement, createIcon } from '../../utils/ui-utils';
import type { ShowMenuAction } from '../menu/menu';
import { ItemMenu, SimpleMenu } from '../menu/menu';
import { EditColorUi } from './color/edit-color-ui';

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
      actions: () => []
    });
  }

  export function is(object: unknown): object is ShowQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

export class QuickActionMenu extends ItemMenu {
  protected menuCssClass = ['bar-menu', 'quick-action-bar-menu'];
  protected editUi?: EditColorUi;

  constructor(
    readonly actionDispatcher: IActionDispatcher,
    readonly action: ShowQuickActionMenuAction,
    protected paletteItems: Array<PaletteItem>
  ) {
    super(actionDispatcher, action, paletteItems);
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
      button.appendChild(createElement('span', ['new-color-icon', 'ivy', `ivy-${IvyIcons.Plus}`]));
      button.insertAdjacentText('beforeend', t('label.colorNew'));
      button.onclick = () => this.editUi?.showEditUi();
      button.onmouseenter = () => this.focusButton(button);
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
    const editButton = createIcon(IvyIcons.Edit, ['color-edit-button']);
    editButton.title = t('label.colorEdit');
    editButton.onclick = (ev: MouseEvent) => {
      ev.stopPropagation();
      this.editUi?.showEditUi(item);
    };
    return editButton;
  }

  protected appendPaletteIcon(item: PaletteItem): Node {
    if (this.action.isEditable) {
      if (item.icon && item.icon.length > 0) {
        const span = createElement('span', ['color-icon']);
        span.style.backgroundColor = item.icon;
        return span;
      } else {
        return createElement('span', ['empty-icon']);
      }
    }
    return super.appendPaletteIcon(item);
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

  export function is(object: unknown): object is ShowInfoQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

type InfoFormat = 'CODE' | 'STRING';

export class InfoQuickActionMenu extends SimpleMenu {
  constructor(readonly action: ShowInfoQuickActionMenuAction) {
    super();
  }

  override createMenuBody(bodyDiv: HTMLElement): void {
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
    const htmlText = marked.parse(description, { async: false, breaks: true });
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

  private createIssue(sIssue: GIssue): HTMLElement {
    const issue = createElement('div', ['menu-issue']);
    const issueTitle = createElement('div', ['menu-issue-title']);
    issueTitle.appendChild(createIcon(this.ivyIconForSeverity(sIssue.severity)));
    const issueTitleSpan = createElement('span');
    issueTitleSpan.textContent = sIssue.severity === 'error' ? t('label.error') : t('label.warning');
    issueTitle.appendChild(issueTitleSpan);
    issue.appendChild(issueTitle);

    const issueMessage = createElement('p', ['menu-issue-message']);
    issueMessage.textContent = sIssue.message;
    issue.appendChild(issueMessage);
    return issue;
  }

  private ivyIconForSeverity(severity: GIssueSeverity) {
    switch (severity) {
      case 'info':
        return IvyIcons.InfoCircle;
      case 'warning':
        return IvyIcons.Caution;
      case 'error':
        return IvyIcons.ErrorXMark;
    }
  }
}
