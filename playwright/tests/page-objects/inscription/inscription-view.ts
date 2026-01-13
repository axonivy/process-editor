import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { InscriptionTab } from './inscription-tab';
import { Outline } from './outline';

export const server = process.env.BASE_URL
  ? `${process.env.BASE_URL}${process.env.TEST_WS}`
  : 'localhost:8080/~Developer-inscription-test-project';
const app = process.env.TEST_APP ?? 'Developer-inscription-test-project';
const pmv = 'inscription-test-project';

export const openElementInscription = async (page: Page, pid: string) => {
  const serverUrl = server.replace(/^https?:\/\//, '');
  const url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&pid=${pid}`;
  await page.goto(url);
  await initPage(page);
  const view = new Inscription(page);
  await view.waitForView();
  return view;
};

export const openMockInscription = async (page: Page, options?: { type?: string; readonly?: boolean; theme?: string }) => {
  let url = 'mock.html';
  if (options) {
    url += '?';
    if (options.type) {
      url += `type=${options.type}&`;
    }
    if (options.readonly) {
      url += `readonly=${options.readonly}&`;
    }
    if (options.theme) {
      url += `theme=${options.theme}&`;
    }
  }
  await page.goto(url);
  await initPage(page);
  const view = new Inscription(page);
  await view.waitForView();
  return view;
};

const initPage = async (page: Page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
};

export class Inscription {
  readonly view: Locator;
  readonly root: Locator;

  constructor(
    readonly page: Page,
    parent?: Locator
  ) {
    this.view = parent ?? page.locator('body');
    this.root = this.view.locator('.editor-root');
  }

  locator() {
    return this.view;
  }

  inscriptionTab(partName: string) {
    return new InscriptionTab(this.page, partName);
  }

  async expectHeaderText(text: string | RegExp, timeout?: number) {
    await expect(this.view.locator('.header')).toContainText(text, { timeout });
  }

  async expectMutationStateSuccess() {
    await expect(this.root).toHaveAttribute('data-mutation-state', 'success');
  }

  reset() {
    return this.page.locator('button[aria-label^="Reset"]');
  }

  async waitForView() {
    await expect(this.root).toBeVisible();
  }

  async expectOpen() {
    await expect(this.view).not.toHaveClass(/hidden/);
  }

  async expectClosed() {
    await expect(this.view).toHaveClass(/hidden/);
  }

  async toggleOutline() {
    const outline = new Outline(this.page, this.view);
    await outline.open();
    return outline;
  }
}
