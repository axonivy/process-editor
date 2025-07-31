import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import type { Menu } from '../../page-objects/editor/menu';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('additional info', async ({ page }) => {
  const menu = await openInfoMenu(page, '1842D6FBB6A107AB-f0');
  await assertTitle(menu, 'start.ivp');
  await assertAdditionalInfo(menu, 'Request Role', 'TestRole1');
  await assertAdditionalInfo(menu, 'Task Responsible', 'TestRole2');
});

test('code info', async ({ page }) => {
  const menu = await openInfoMenu(page, '1842D6FBB6A107AB-f31');
  await assertAdditionalCodeInfo(menu, 'variable.source());\n...');
});

test('description', async ({ page }) => {
  const menu = await openInfoMenu(page, '1842D6FBB6A107AB-f3');
  const description = menu.locator().locator('.simple-menu-text', { hasText: 'title' });
  await expect(description.locator('h1')).toHaveText('title');
  await expect(description.locator('p')).toHaveText('blablabla');
});

test('edge - condition', async ({ page }) => {
  const menu = await openInfoMenu(page, '1842D6FBB6A107AB-f7');
  await assertTitle(menu, 'false');
  await assertAdditionalInfo(menu, 'Condition', 'false');
});

test('edge - in/out', async ({ page }) => {
  const menu = await openInfoMenu(page, '1842D6FBB6A107AB-f30');
  await assertTitle(menu, 'blu [in2]');
});

test('embedded proc - outerElement', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/info.p.json' });
  const embedded = processEditor.elementByPid('1842D6FBB6A107AB-S10');
  const embeddedStart = processEditor.elementByPid('1842D6FBB6A107AB-S10-g0');
  await embedded.quickActionBar().trigger('Jump', 'startsWith');
  await embeddedStart.quickActionBar().trigger('Information (I)');
  await assertTitle(embeddedStart.quickActionBar().infoMenu(), 'in 1 [start4.ivp]');
});

async function assertTitle(menu: Menu, expectedTitle?: string): Promise<void> {
  const title = menu.locator().locator('.simple-menu-header');
  if (expectedTitle) {
    await expect(title).toHaveText(expectedTitle);
  } else {
    await expect(title).toBeHidden();
  }
}

async function assertAdditionalInfo(menu: Menu, infoLabel: string, infoValue: string): Promise<void> {
  const text = menu.locator().locator('.simple-menu-text', { hasText: infoLabel });
  await expect(text).toContainText(infoValue);
}

async function assertAdditionalCodeInfo(menu: Menu, code: string): Promise<void> {
  const text = menu.locator().locator('.simple-menu-text', { hasText: 'Code' });
  await expect(text.locator('pre')).toContainText(code);
}

async function openInfoMenu(page: Page, pid: string) {
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/info.p.json' });
  const element = processEditor.elementByPid(pid);
  await element.quickActionBar().trigger('Information (I)');
  await expect(element.quickActionBar().infoMenu().locator().locator('.simple-menu-text.simple-menu-small', { hasText: 'PID' })).toBeVisible();
  return element.quickActionBar().infoMenu();
}
