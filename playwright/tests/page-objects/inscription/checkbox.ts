import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class Checkbox {
  private readonly locator: Locator;

  constructor(parentLocator: Locator, label: string) {
    this.locator = parentLocator.getByLabel(label);
  }

  async click() {
    await this.locator.click();
  }

  async expectChecked() {
    await expect(this.locator).toBeChecked();
  }

  async expectUnchecked() {
    await expect(this.locator).not.toBeChecked();
  }
}
