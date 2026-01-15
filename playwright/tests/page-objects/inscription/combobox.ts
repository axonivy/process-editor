import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Combobox {
  readonly locator: Locator;

  constructor(
    readonly page: Page,
    parentLocator: Locator,
    options?: { label?: string; nth?: number }
  ) {
    if (options?.label) {
      this.locator = parentLocator.getByRole('combobox', { name: options.label }).first();
    } else {
      this.locator = parentLocator.getByRole('combobox').nth(options?.nth ?? 0);
    }
  }

  async fill(value: string) {
    await this.locator.fill(value);
    await this.locator.blur();
  }

  async choose(value: string) {
    await this.locator.click();
    await this.locator.fill(value);
    await this.page.getByRole('option', { name: value }).first().click();
  }

  async expectValue(value: string | RegExp) {
    await expect(this.locator).toHaveValue(value);
  }
}
