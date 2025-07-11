import type { PartStateFlag } from '@axonivy/process-editor-inscription-view/src/components/editors/part/usePart';
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Part } from './part';
import { Tab } from './tab';

export class InscriptionTab extends Part {
  readonly tabButtonLocator: Locator;

  constructor(
    page: Page,
    readonly label: string
  ) {
    super(page, InscriptionTab.locator(page));
    this.tabButtonLocator = InscriptionTab.tabButtonLocator(page, label);
  }

  async open() {
    await expect(this.tabButtonLocator).toBeVisible();
    if ((await this.tabButtonLocator.getAttribute('aria-selected')) !== 'true') {
      await this.tabButtonLocator.click();
    }
    await this.expectOpen();
  }

  private static locator(page: Page) {
    return page.locator('.ui-inscription-tabs');
  }

  private static tabButtonLocator(page: Page, label: string) {
    return page.getByRole('tab', { name: label });
  }

  tab(label: string) {
    return new Tab(this.page, this.locator, label);
  }

  async expectState(state: PartStateFlag) {
    const stateLocator = this.tabButtonLocator.locator('.ui-state-dot');
    if (state) {
      await expect(stateLocator).toHaveAttribute('data-state', state);
    } else {
      await expect(stateLocator).toBeHidden();
    }
  }

  async expectOpen() {
    await expect(this.tabButtonLocator).toHaveAttribute('aria-selected', 'true');
  }

  async expectClosed() {
    await expect(this.tabButtonLocator).toHaveAttribute('aria-selected', 'false');
  }
}
