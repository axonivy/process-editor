import { expect, type Locator, type Page } from '@playwright/test';

export class Menu {
  protected readonly page: Page;

  constructor(
    page: Page,
    readonly menu: Locator
  ) {
    this.page = page;
  }

  locator() {
    return this.menu;
  }

  emptyResult() {
    return this.menu.locator('.no-result');
  }

  searchInput() {
    return this.menu.locator('.menu-search-input');
  }

  async click(entry: string) {
    await this.menu.locator(`.menu-item:has-text("${entry}")`).click();
  }

  async expectMenuItemCount(count: number) {
    await expect(this.menu.locator('.menu-item')).toHaveCount(count);
  }

  async expectMenuGroupCount(count: number) {
    const headers = this.menu.locator('.menu-group-header');
    await expect(headers).toHaveCount(count);
  }

  async expectMenuGroups(headerGroups: string[]) {
    await this.expectMenuGroupCount(headerGroups.length);
    const headers = this.menu.locator('.menu-group-header');
    for (const [index, group] of headerGroups.entries()) {
      await expect(headers.nth(index)).toHaveText(group);
    }
  }

  async search(search: string) {
    const input = this.searchInput();
    await input.fill(search);
    await input.dispatchEvent('keyup');
  }

  async expectVisible() {
    await expect(this.menu).toBeVisible();
  }

  async expectHidden() {
    await expect(this.menu).toBeHidden();
  }
}

export class OptionsMenu extends Menu {
  async toggleOption(option: string, initalValue: boolean) {
    const toggle = this.menu.locator(`.tool-bar-option label:has-text("${option}") ~ .switch`);
    const toggleInput = toggle.locator('> input');
    if (initalValue) {
      await expect(toggleInput).toBeChecked();
    } else {
      await expect(toggleInput).not.toBeChecked();
    }
    await toggle.click();
  }
}
