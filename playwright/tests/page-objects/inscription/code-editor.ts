import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

class CodeEditor {
  private readonly contentAssist: Locator;
  private readonly code: Locator;
  private readonly scriptArea: Locator;

  constructor(
    readonly page: Page,
    readonly locator: Locator,
    readonly value: Locator,
    readonly parentLocator: Locator
  ) {
    this.contentAssist = parentLocator.locator('div.suggest-widget');
    this.code = parentLocator.locator('div.code-input').first();
    this.scriptArea = parentLocator.locator('div.script-area');
  }

  async triggerContentAssist() {
    await this.focus();
    await expect(this.contentAssist).toBeHidden();
    await this.page.keyboard.press('Control+Space');
    await expect(this.contentAssist).toBeVisible();
  }

  async fill(value: string) {
    await this.focus();
    await this.clearContent();
    await this.page.keyboard.type(value);
    await this.blur();
  }

  async clear() {
    await this.focus();
    await this.clearContent();
    await this.blur();
  }

  async expectCodeFocused() {
    await this.waitLazyLoading();
    await expect(this.code).toBeVisible();
  }

  async expectBrowserButtonFocused() {
    await expect(this.scriptArea.getByRole('button', { name: 'Browser' })).toBeFocused();
  }

  async focus() {
    await this.locator.click();
    await this.expectCodeFocused();
  }

  async openBrowsers() {
    await this.focus();
    await this.scriptArea.getByRole('button', { name: 'Browser' }).click();
    await expect(this.page.locator('.browser-content')).toBeVisible();
    return new Browser(this.page);
  }

  async openFullScreen() {
    await this.focus();
    await this.page.getByRole('button', { name: 'Fullsize Code Editor' }).click();
    await expect(this.page.locator('.browser-content')).toBeVisible();
    return new Browser(this.page);
  }

  async waitLazyLoading() {
    await expect(this.code).not.toHaveText('Loading Editor...');
  }

  private async blur() {
    await this.page.locator('*:focus').blur();
  }

  protected async clearContent() {
    if (this.page.context().browser()?.browserType().name() === 'webkit') {
      await this.page.keyboard.press('Meta+KeyA');
    } else {
      await this.page.keyboard.press('Control+KeyA');
    }
    await this.page.keyboard.press('Delete');
    await expect(this.code).toHaveText('');
  }

  async expectValue(value: string) {
    await expect(this.value).toHaveValue(value);
  }

  async expectEmpty() {
    await expect(this.value).toBeEmpty();
  }

  async expectContentAssistContains(contentAssist: string) {
    await expect(this.contentAssist).toContainText(contentAssist);
  }
}

export class Browser {
  constructor(readonly page: Page) {}

  async openTab(name: string) {
    const tab = this.page.locator('button.tabs-trigger', { hasText: name });
    tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  async search(lookup: string) {
    const search = this.dialog.getByRole('textbox');
    await search.click();
    await search.focus();
    await search.fill('');
    await search.pressSequentially(lookup);
  }

  get dialog() {
    return this.page.getByRole('dialog');
  }

  get table() {
    return this.dialog.locator('.ui-table');
  }

  get help() {
    return this.dialog.locator('.browser-helptext');
  }
}

export class ScriptArea extends CodeEditor {
  constructor(page: Page, parentLocator: Locator) {
    const locator = parentLocator.getByRole('code').nth(0);
    super(page, locator, locator.getByRole('textbox'), parentLocator);
  }
}

export class ScriptInput extends CodeEditor {
  constructor(page: Page, parentLocator: Locator, label?: string) {
    let locator = parentLocator.getByRole('textbox').first();
    if (label) {
      locator = parentLocator.getByLabel(label, { exact: true }).first();
    }
    super(page, locator, locator, parentLocator);
  }
}

export class MacroEditor extends CodeEditor {
  constructor(page: Page, parentLocator: Locator, label?: string) {
    let locator = parentLocator.getByRole('status');
    if (label) {
      locator = parentLocator.getByLabel(label, { exact: true }).first();
    }
    super(page, locator, locator, parentLocator);
  }

  override async expectValue(value: string) {
    await expect(this.value).toHaveText(value.replace('\n', ''));
  }
}

export class ScriptCell extends CodeEditor {
  constructor(page: Page, locator: Locator, parentLocator: Locator) {
    super(page, locator, locator, parentLocator);
  }
}
