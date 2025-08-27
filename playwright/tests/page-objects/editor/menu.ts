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
    return this.menu.locator('.ui-palette');
  }

  searchInput() {
    return this.menu.locator('.ui-input');
  }

  async click(entry: string) {
    await this.menu.locator(`.ui-palette-item:has-text("${entry}")`).click();
  }

  async expectMenuItemCount(count: number) {
    await expect(this.menu.locator('.ui-palette-item')).toHaveCount(count);
  }

  async expectMenuGroupCount(count: number) {
    const headers = this.menu.locator('.ui-palette-section-title');
    await expect(headers).toHaveCount(count);
  }

  async expectMenuGroups(headerGroups: string[]) {
    await this.expectMenuGroupCount(headerGroups.length);
    const headers = this.menu.locator('.ui-palette-section-title');
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
    const toggle = this.menu.locator(`.tool-bar-option label:has-text("${option}") ~ [role=switch]`);
    if (initalValue) {
      await expect(toggle).toHaveAttribute('data-state', 'checked');
    } else {
      await expect(toggle).toHaveAttribute('data-state', 'unchecked');
    }
    await toggle.click();
  }
}
