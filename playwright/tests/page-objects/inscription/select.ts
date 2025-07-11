import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Select {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    readonly parentLocator: Locator,
    options?: { label?: string; nth?: number }
  ) {
    if (options?.label) {
      this.locator = parentLocator.getByRole('combobox', { name: options.label }).first();
    } else {
      this.locator = parentLocator.getByRole('combobox').nth(options?.nth ?? 0);
    }
  }

  async clear() {
    await this.choose('');
  }

  async choose(value: string | RegExp) {
    await this.locator.click();
    await this.page.getByRole('option', { name: value, exact: true }).first().click();
  }

  async expectValue(value: string | RegExp) {
    await expect(this.locator).toHaveText(value);
  }
}
