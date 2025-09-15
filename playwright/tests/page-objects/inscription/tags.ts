import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Tags {
  constructor(
    readonly page: Page,
    readonly locator: Locator
  ) {}

  async addTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      const newTagBtn = this.locator.getByRole('button', { name: 'Add new tag' });
      await newTagBtn.click();
      const input = newTagBtn.locator('input');
      await input.fill(tags[i]!);
      await input.press('Enter');
    }
  }

  async chooseTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      const newTagBtn = this.locator.getByRole('button', { name: 'Add new tag' });
      await newTagBtn.click();
      const roleOption = this.page.getByRole('option', { name: tags[i] });
      await roleOption.click();
    }
  }

  async clearTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      await this.locator.getByRole('button', { name: `Remove Tag ${tags[i]}` }).click();
    }
  }

  async expectTags(tags: string[]) {
    for (let i = 0; i < tags.length; i++) {
      await expect(this.locator.getByRole('gridcell').nth(i)).toHaveText(tags[i]!);
    }
  }

  async expectEmpty() {
    await expect(this.locator.getByRole('gridcell')).toHaveCount(0);
  }
}
