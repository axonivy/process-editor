import type { Action, IActionDispatcher, MaybePromise, PaletteItem } from '@eclipse-glsp/client';
import { compare } from '@eclipse-glsp/client';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { ActivityTypes, EventIntermediateTypes, EventStartTypes } from '../../diagram/view-types';
import { IvyIcons } from '@axonivy/ui-icons';
import { createElement, createIcon } from '../../utils/ui-utils';
import { MenuIcons } from './icons';
import { t } from 'i18next';

export interface ShowMenuAction extends Action {
  paletteItems: () => MaybePromise<Array<PaletteItem>>;
  showSearch?: boolean;
  customCssClass?: string;
}

export interface Menu {
  create(containerElement: HTMLElement): HTMLElement;
  remove(): void;
}

export abstract class SimpleMenu implements Menu {
  protected menuCssClass = ['bar-menu', 'simple-menu'];
  bodyDiv?: HTMLElement;

  public create(containerElement: HTMLElement): HTMLElement {
    this.bodyDiv = createElement('div', this.menuCssClass);
    containerElement.appendChild(this.bodyDiv);
    this.createMenuBody(this.bodyDiv);
    return this.bodyDiv;
  }

  abstract createMenuBody(bodyDiv: HTMLElement): void;

  public remove(): void {
    this.bodyDiv?.remove();
  }
}

export abstract class ItemMenu implements Menu {
  static ACTIVE_ELEMENT = 'focus';
  static ITEM_GROUP = 'menu-group';
  static ITEM_BUTTON = 'menu-item';

  protected menuCssClass = ['bar-menu'];
  protected paletteItemsCopy: PaletteItem[] = [];
  protected bodyDiv?: HTMLElement;
  protected searchField?: HTMLInputElement;
  protected itemsDiv?: HTMLElement;

  constructor(
    readonly actionDispatcher: IActionDispatcher,
    readonly action: ShowMenuAction,
    protected paletteItems: Array<PaletteItem>
  ) {
    this.paletteItemsCopy = JSON.parse(JSON.stringify(this.paletteItems));
  }

  public create(containerElement: HTMLElement): HTMLElement {
    this.bodyDiv = createElement('div', this.menuCssClass);
    containerElement.appendChild(this.bodyDiv);
    if (this.action.customCssClass) {
      this.bodyDiv.classList.add(this.action.customCssClass);
    }
    if (this.action.showSearch) {
      this.bodyDiv.appendChild(this.createPaletteItemSearchField());
    }
    this.createItemsDiv(this.bodyDiv);
    this.appendMenuParts(this.bodyDiv);
    return this.bodyDiv;
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected appendMenuParts(body: HTMLElement): void {}

  private createPaletteItemSearchField(): HTMLElement {
    const searchDiv = createElement('div', ['bar-menu-search']);
    searchDiv.appendChild(createIcon(IvyIcons.Search));

    this.searchField = createElement('input', ['menu-search-input']) as HTMLInputElement;
    this.searchField.type = 'text';
    this.searchField.placeholder = t('common.label.search');
    this.searchField.onkeyup = ev => this.filterKeyUp(ev);
    this.searchField.onkeydown = ev => this.clearSearchInputOnEscape(ev);
    setTimeout(() => this.searchField?.focus(), 1);
    searchDiv.appendChild(this.searchField);
    return searchDiv;
  }

  private filterKeyUp(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'ArrowUp') || matchesKeystroke(event, 'ArrowLeft')) {
      this.navigateUpOrDown(-1);
    } else if (matchesKeystroke(event, 'ArrowDown') || matchesKeystroke(event, 'ArrowRight')) {
      this.navigateUpOrDown(1);
    } else if (matchesKeystroke(event, 'Enter')) {
      this.triggerItem();
    } else {
      this.requestFilterUpdate(this.searchField?.value ?? '');
    }
  }

  private clearSearchInputOnEscape(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'Escape') && this.searchField) {
      this.searchField.value = '';
      this.requestFilterUpdate('');
    }
  }

  private requestFilterUpdate(filter: string): void {
    this.paletteItems = JSON.parse(JSON.stringify(this.paletteItemsCopy));
    const filteredPaletteItems: PaletteItem[] = [];
    for (const itemGroup of this.paletteItems) {
      if (itemGroup.children) {
        const matchingChildren = itemGroup.children.filter(child => child.label.toLowerCase().includes(filter.toLowerCase()));
        if (matchingChildren.length > 0) {
          itemGroup.children.splice(0, itemGroup.children.length);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          matchingChildren.forEach(child => itemGroup.children!.push(child));
          filteredPaletteItems.push(itemGroup);
        }
      }
    }
    this.paletteItems = filteredPaletteItems;
    if (this.bodyDiv) {
      this.createItemsDiv(this.bodyDiv);
    }
  }

  private navigateUpOrDown(move: number): void {
    if (this.itemsDiv) {
      const buttons = Array.from(this.itemsDiv.querySelectorAll(`.${ItemMenu.ITEM_BUTTON}`));
      const currentFocus = buttons.filter(e => e.classList.contains(ItemMenu.ACTIVE_ELEMENT))[0];
      let nextIndex = buttons.indexOf(currentFocus) + move;
      if (nextIndex < 0) {
        nextIndex = buttons.length - 1;
      } else if (nextIndex >= buttons.length) {
        nextIndex = 0;
      }
      const nextButton = buttons[nextIndex];
      this.focusButton(nextButton);
      nextButton?.scrollIntoView({ behavior: 'instant', block: 'end', inline: 'end' });
    }
  }

  private triggerItem(): void {
    const currentItem = this.currentItem() as HTMLElement;
    currentItem?.click();
  }

  private createItemsDiv(bodyDiv: HTMLElement): void {
    const itemsDiv = createElement('div', ['bar-menu-items']);
    let tabIndex = 0;
    this.paletteItems.sort(compare).forEach(item => {
      if (item.children && item.children.length > 0) {
        const groupItems = this.createToolGroup(itemsDiv, item);
        item.children.sort(compare).forEach(child => groupItems.appendChild(this.createToolButton(child, tabIndex++)));
        this.appendItemToGroup(groupItems);
      }
    });
    if (this.paletteItems.length === 0 || itemsDiv.childElementCount === 0) {
      const noResultsDiv = createElement('div');
      noResultsDiv.innerText = t('label.empty');
      noResultsDiv.classList.add('no-result');
      itemsDiv.appendChild(noResultsDiv);
    }
    // Remove existing body to refresh filtered entries
    if (this.itemsDiv) {
      bodyDiv.removeChild(this.itemsDiv);
    }
    bodyDiv.appendChild(itemsDiv);
    this.itemsDiv = itemsDiv;
    this.navigateUpOrDown(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected appendItemToGroup(group: HTMLElement): void {}

  private createToolGroup(parent: HTMLElement, item: PaletteItem): HTMLElement {
    const group = createElement('div', [ItemMenu.ITEM_GROUP]);
    group.id = item.id;
    parent.appendChild(group);

    const groupHeader = createElement('div', ['menu-group-header']);
    groupHeader.textContent = item.label;
    group.appendChild(groupHeader);

    const groupItems = createElement('div', ['menu-group-items']);
    group.appendChild(groupItems);

    group.appendChild(createElement('div', ['menu-group-divider']));
    return groupItems;
  }

  private createToolButton(item: PaletteItem, index: number): HTMLElement {
    const button = createElement('div', [ItemMenu.ITEM_BUTTON]);
    button.tabIndex = index;
    const icon = createElement('div', ['menu-item-icon']);
    icon.appendChild(this.appendPaletteIcon(item));
    button.appendChild(icon);
    const text = createElement('div', ['menu-item-text']);
    text.appendChild(createElement('span', ['menu-item-label'], item.label));
    if ('info' in item && typeof item.info === 'string') {
      text.appendChild(createElement('span', ['menu-item-info'], item.info));
    }
    button.appendChild(text);
    button.onclick = () => this.actionDispatcher.dispatchAll(this.toolButtonOnClick(item));
    button.onmouseenter = () => this.focusButton(button);
    if ('description' in item && typeof item.description === 'string' && item.description !== 'undefined') {
      button.title = item.description;
    } else {
      button.title = item.label;
    }
    this.appendToToolButton(text, item);
    return button;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected appendToToolButton(button: HTMLElement, item: PaletteItem): void {}

  abstract toolButtonOnClick(item: PaletteItem): Action[];

  protected focusButton(button?: Element): void {
    this.currentItem()?.classList.remove(ItemMenu.ACTIVE_ELEMENT);
    button?.classList.add(ItemMenu.ACTIVE_ELEMENT);
  }

  private currentItem(): Element | null | undefined {
    return this.itemsDiv?.querySelector(`.${ItemMenu.ITEM_BUTTON}.${ItemMenu.ACTIVE_ELEMENT}`);
  }

  protected appendPaletteIcon(item: PaletteItem): Node {
    if (!item.icon) {
      return createIcon();
    }
    const icon = this.resolveIcon(item.icon);
    if (icon) {
      return createIcon(icon);
    }
    const img = createElement('img') as HTMLImageElement;
    img.src = item.icon;
    return img;
  }

  private resolveIcon(type: string) {
    if (type.startsWith(ActivityTypes.THIRD_PARTY)) {
      return MenuIcons.get(ActivityTypes.THIRD_PARTY);
    }
    if (type.startsWith(EventStartTypes.START_THIRD_PARTY)) {
      return MenuIcons.get(EventStartTypes.START_THIRD_PARTY);
    }
    if (type.startsWith(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY)) {
      return MenuIcons.get(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY);
    }
    return MenuIcons.get(type);
  }
}
