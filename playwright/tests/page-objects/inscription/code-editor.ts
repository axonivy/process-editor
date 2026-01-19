import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

class CodeEditor {
  private readonly contentAssist: Locator;
  readonly code: Locator;
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

  async activate() {
    if (await this.locator.isVisible()) {
      // we may need to click before the editor is actually triggered to load
      // or we simply want to click into the editor to have it properly focussed
      await this.locator.click();
    }
    await this.loaded();
  }

  async loaded() {
    await this.expectLoaded();
    await expect(this.code).toBeVisible();
    await this.code.click();
  }

  async expectLoaded() {
    // code-input might already be in the DOM but not yet fully loaded
    await expect(this.code).not.toHaveClass(/loading/);
    await expect(this.code.locator('.view-lines')).toBeVisible();
  }

  async expectCodeFocused() {
    await expect(this.code.locator('.focused').first()).toBeVisible();
  }

  async fill(value: string, expectedValue = value) {
    if (!value) {
      return this.clear();
    }
    await this.activate();
    await this.selectAll();
    await this.page.keyboard.type(value);
    await this.expectCode(expectedValue);
    await this.blur();
  }

  async clear() {
    await this.activate();
    await this.clearInternal();
    await this.blur();
  }

  protected async clearInternal() {
    await this.selectAll();
    await this.page.keyboard.press('Delete');
    await this.expectCode('');
  }

  protected async selectAll() {
    const selectAll = this.page.context().browser()?.browserType().name() === 'webkit' ? 'Meta+KeyA' : 'Control+KeyA';
    await this.page.keyboard.press(selectAll);
  }

  async expectValue(value: string) {
    if (await this.value.evaluate(element => element.tagName.toLowerCase() === 'input')) {
      await expect(this.value).toHaveValue(value);
    } else {
      await this.expectCode(value);
    }
  }

  protected async expectCode(value: string) {
    await expectCodeInEditor(this.code, value);
  }

  async expectEmpty() {
    await this.expectValue('');
  }

  async expectBrowserButtonFocused() {
    await expect(this.scriptArea.getByRole('button', { name: 'Browser' })).toBeFocused();
  }

  async openBrowsers() {
    await this.activate();
    await this.scriptArea.getByRole('button', { name: 'Browser' }).click();
    await expect(this.page.locator('.browser-content')).toBeVisible();
    return new Browser(this.page);
  }

  async openFullScreen() {
    await this.activate();
    await this.page.getByRole('button', { name: 'Fullsize Code Editor' }).click();
    await expect(this.page.locator('.browser-content')).toBeVisible();
    return new Browser(this.page);
  }

  async blur() {
    await this.page.locator('*:focus').blur();
  }

  async triggerContentAssist() {
    await this.activate();
    await expect(this.contentAssist).toBeHidden();
    await this.page.keyboard.press('Control+Space');
    await expect(this.contentAssist).toBeVisible();
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

export function expectCodeInEditor(locator: Locator, value: string) {
  const code = locator.locator('.view-lines');
  return expect(code).toHaveText(value.replace('\n', ''));
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

  override async clearInternal() {
    if ((await this.code.locator('.monaco-editor').all()).length > 0) {
      return super.clearInternal();
    }
    // Unknown type of script cell, fallback to textbox clear
    await this.locator.clear();
  }
}
