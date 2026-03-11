import { expect, type Locator, type Page } from '@playwright/test';

export class History {
  readonly parent: Locator;
  readonly popover: Locator;
  readonly pinned: Locator;
  readonly title: Locator;
  readonly pinButton: Locator;
  readonly closeButton: Locator;
  readonly table: Locator;

  constructor(readonly page: Page) {
    this.parent = page.locator('.history-ui-container');
    this.popover = this.parent.locator('.ui-popover-content');
    this.pinned = this.parent.locator('.history-pinned');
    this.title = this.parent.locator('.ui-fieldset .ui-label');
    this.pinButton = this.parent.getByRole('button', { name: 'Pin' });
    this.closeButton = this.parent.getByRole('button', { name: 'Close' });
    this.table = this.parent.getByRole('table');
  }

  async expectOpen() {
    await expect(this.title).toContainText('History of');
  }

  async expectPinned() {
    await expect(this.pinned).toBeVisible();
    await expect(this.popover).toBeHidden();
  }

  async expectPopover() {
    await expect(this.pinned).toBeHidden();
    await expect(this.popover).toBeVisible();
  }
}
