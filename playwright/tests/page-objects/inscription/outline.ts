import { expect, type Locator, type Page } from '@playwright/test';

export class Outline {
  protected readonly page: Page;
  readonly view: Locator;

  constructor(
    page: Page,
    readonly parentLocator: Locator
  ) {
    this.page = page;
    this.view = parentLocator.locator('.ui-outline');
  }

  async open() {
    await this.parentLocator.getByRole('switch').click();
    await expect(this.view).toBeVisible();
  }

  async expectClosed() {
    await expect(this.view).toBeHidden();
  }

  async expectSelected(name: string) {
    await expect(this.outlineNode(name)).toHaveAttribute('data-state', 'selected');
  }

  async select(name: string) {
    await this.outlineNode(name).click();
    await this.expectSelected(name);
  }

  async doubleClick(name: string) {
    await this.outlineNode(name).dblclick();
  }

  private outlineNode(name: string) {
    return this.view.getByRole('row', { name }).first();
  }
}
