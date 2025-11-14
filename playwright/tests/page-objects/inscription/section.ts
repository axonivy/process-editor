import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Composite } from './composite';
import { ResponsibleComponent } from './responsible-component';

export class Section extends Composite {
  private readonly toggleButtonLocator: Locator;

  constructor(page: Page, parentLocator: Locator, label: string) {
    super(page, Section.locator(page, parentLocator, label));
    this.toggleButtonLocator = parentLocator.locator(Section.toggleButtonLocatorInternal(page, label));
  }

  async toggle() {
    await this.toggleButtonLocator.click();
  }

  async open() {
    if ((await this.toggleButtonLocator.getAttribute('data-state')) === 'closed') {
      await this.toggleButtonLocator.click();
    }
  }

  async close() {
    if ((await this.toggleButtonLocator.getAttribute('data-state')) === 'open') {
      await this.toggleButtonLocator.click();
    }
  }

  async isOpen() {
    return (await this.toggleButtonLocator.getAttribute('data-state')) === 'open';
  }

  async expectIsClosed() {
    await expect(this.toggleButtonLocator).toHaveAttribute('data-state', 'closed');
  }

  async expectIsOpen() {
    await expect(this.toggleButtonLocator).toHaveAttribute('data-state', 'open');
  }

  private static locator(page: Page, parentLocator: Locator, label: string) {
    return parentLocator.locator(`.ui-collapsible`, { has: Section.toggleButtonLocatorInternal(page, label) });
  }

  private static toggleButtonLocatorInternal(page: Page, label: string) {
    const regexLabel = new RegExp(`^${label}$`);
    return page.locator(`.ui-collapsible-trigger`, { hasText: regexLabel });
  }

  section(label: string) {
    return new Section(this.page, this.locator, label);
  }

  responsibleComponent() {
    return new ResponsibleComponent(this);
  }
}
