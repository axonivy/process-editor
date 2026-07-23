import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class MultiSelect {
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
    await this.locator.fill(value);
    await this.page.getByRole('option', { name: value }).first().click();
  }

  async expectValue(value: string | RegExp) {
    await expect(this.locator).toHaveAttribute('data-value', value);
  }

  async expectChipItem(label: string, options?: { emoji?: string; description?: string }) {
    const chipLocator = this.page.locator('[class*="ui-combobox-root-chip"]').filter({ hasText: label });

    await expect(chipLocator).toBeVisible();
    await expect(chipLocator.getByText(label, { exact: true })).toBeVisible();

    if (options?.emoji) {
      const emojiSpan = chipLocator.locator('span[aria-hidden="true"]');
      await expect(emojiSpan).toContainText(options.emoji);
    }
    if (options?.description) {
      await expect(chipLocator).toHaveAttribute('title', options.description);
    }
  }
}
