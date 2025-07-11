import { expect, type Locator, type Page } from '@playwright/test';
import type { BaseElement } from './element';
import { LabelEdit } from './label-edit';
import { Menu } from './menu';

export class QuickActionBar {
  protected readonly page: Page;
  protected readonly bar: Locator;
  protected readonly quickActionMenu: Menu;
  protected readonly simpleMenu: Menu;

  constructor(
    page: Page,
    readonly element?: BaseElement
  ) {
    this.page = page;
    this.bar = this.page.locator('.quick-actions-bar');
    this.quickActionMenu = new Menu(page, this.page.locator('.quick-action-bar-menu'));
    this.simpleMenu = new Menu(page, this.page.locator('.simple-menu'));
  }

  locator() {
    return this.bar;
  }

  menu() {
    return this.quickActionMenu;
  }

  infoMenu() {
    return this.simpleMenu;
  }

  async trigger(label: string, option?: 'startsWith' | 'endsWith') {
    await this.element?.select();
    const find = option === 'startsWith' ? '^' : option === 'endsWith' ? '$' : '';
    await this.bar.locator(`button[title${find}="${label}"]`).click();
  }

  async pressShortCut(shortcut: string) {
    await this.element?.select();
    await expect(this.bar.locator(`button[title$="(${shortcut})"]`).first()).toBeVisible();
    await this.page.keyboard.press(shortcut);
  }

  async createElement(group: 'Events' | 'Gateways' | 'Activities', type: string) {
    await this.trigger(`${group} (A)`);
    await this.quickActionMenu.click(type);
    return this.menu();
  }

  async changeType(type: string) {
    await this.trigger('Select Activity Type');
    await this.quickActionMenu.click(type);
    return this.menu();
  }

  async editLabel() {
    await this.trigger('Edit Label (L)');
    return new LabelEdit(this.page);
  }

  async addColor(name = 'TestColor', color = '#0000ff') {
    await this.quickActionMenu.expectHidden();
    await this.trigger('Select color');
    await this.quickActionMenu.expectVisible();

    await this.quickActionMenu.click('New Color');
    const editUi = this.quickActionMenu.locator().locator('.edit-color');
    await expect(editUi).toBeVisible();
    await expect(editUi.locator('.edit-color-delete')).toBeHidden();

    const nameInput = editUi.locator('#input-Name');
    await expect(nameInput).toBeEmpty();
    await nameInput.fill(name);

    const colorInput = editUi.locator('#input-Color');
    await expect(colorInput).toBeEmpty();
    await colorInput.fill(color);

    await editUi.locator('.edit-color-save').click();
    await expect(editUi).toBeHidden();
    await this.quickActionMenu.expectHidden();
  }

  async count(count: number) {
    await expect(this.bar.locator('button')).toHaveCount(count);
  }
}
