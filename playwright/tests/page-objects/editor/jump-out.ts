import { expect, type Locator, type Page } from '@playwright/test';

export class JumpOutBar {
  readonly page: Page;
  readonly bar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bar = this.page.locator('#sprotty_ivy-jump-out-bar button');
  }

  async click() {
    await this.bar.click();
  }

  async expectVisible() {
    await expect(this.bar).toBeVisible();
  }

  async expectHidden() {
    await expect(this.bar).toBeHidden();
  }
}
