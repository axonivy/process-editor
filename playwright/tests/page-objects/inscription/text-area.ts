import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TextArea {
  readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.getByLabel(options.label);
    } else {
      this.locator = parentLocator.getByRole('textbox').nth(options?.nth ?? 0);
    }
  }

  async fill(value: string) {
    await this.locator.fill(value);
  }

  async clear() {
    await this.locator.clear();
  }

  async expectValue(value: string) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectEmpty() {
    await expect(this.locator).toBeEmpty();
  }

  async expectEnabled() {
    await expect(this.locator).toBeEnabled();
  }

  async expectDisabled() {
    await expect(this.locator).toBeDisabled();
  }
}
