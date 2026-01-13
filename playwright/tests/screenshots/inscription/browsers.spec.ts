import { expect, test, type Page } from '@playwright/test';
import { Browser } from '../../page-objects/inscription/code-editor';
import { openElementInscription } from '../../page-objects/inscription/inscription-view';
import type { Section } from '../../page-objects/inscription/section';
import { screenshot } from './screenshot-util';

const GENERIC_PID = {
  SCRIPT: '168F0C6DF682858E-f3',
  USER_TASK: '168F0C6DF682858E-f5',
  DATABASE: '18141E75C9CEDD35-f3'
} as const;

test.describe('Browsers', () => {
  test('ScriptingBrowser', async ({ page }) => {
    const section = await openSection(page, GENERIC_PID.SCRIPT, 'Output', 'Code');
    const browser = await section.scriptArea().openBrowsers();
    const dialog = browser.dialog;

    await browser.openTab('Attribute');
    await browser.table.getByRole('row', { name: 'addPerson' }).first().click();
    await expect(browser.help).toContainText('in.addPerson');
    await screenshot(dialog, 'browser-attribute.png');

    await browser.openTab('CMS');
    await browser.search('subject');
    await browser.table.getByRole('row', { name: 'subject' }).click();
    await expect(browser.help).toContainText('Welcome');
    await screenshot(dialog, 'browser-cms.png');

    await browser.openTab('Function');
    await browser.search('role');
    await browser.table.getByRole('row', { name: 'security :' }).click();
    await expect(browser.help).toContainText('ivy.security');
    await screenshot(dialog, 'browser-function.png');

    await browser.openTab('Type');
    await browser.search('Per');
    await browser.table.getByRole('row', { name: 'Person :' }).first().click();
    await expect(browser.help).toContainText('registered webshop user');
    await screenshot(dialog, 'browser-type.png');
  });

  test('CodeFullScreen', async ({ page }) => {
    const section = await openSection(page, GENERIC_PID.SCRIPT, 'Output', 'Code');
    const browser = await section.scriptArea().openFullScreen();
    const dialog = browser.dialog;
    await screenshot(dialog, 'browser-codeFullscreen.png');
  });

  test('RoleBrowser', async ({ page }) => {
    const section = await openSection(page, GENERIC_PID.USER_TASK, 'Task', 'Responsible');
    await section.currentLocator().getByLabel('Browser').click();
    const browser = new Browser(page);
    await browser.table.getByRole('row', { name: 'IT-Manager' }).click();
    await expect(browser.help).toContainText('IT-Manager');
    await screenshot(browser.dialog, 'browser-role.png');
  });

  test('DatabaseBrowser', async ({ page }) => {
    const section = await openSection(page, GENERIC_PID.DATABASE, 'Query', 'Condition');
    await section.currentLocator().locator('.script-area').click();
    await section.currentLocator().getByLabel('Browser').click();
    const browser = new Browser(page);
    await browser.table.getByRole('row', { name: 'NAME: VARCHAR', exact: true }).click();
    await expect(browser.help).toContainText('NAME');
    await screenshot(browser.dialog, 'browser-dbColumn.png');
  });
});

async function openSection(page: Page, pid: string, inscriptionTabName: string, sectionName: string): Promise<Section> {
  const view = await openElementInscription(page, pid);
  await page.addStyleTag({ content: 'body { overflow: hidden; }' });
  const tab = view.inscriptionTab(inscriptionTabName);
  await tab.open();
  const section = tab.section(sectionName);
  await section.open();
  await page.setViewportSize({ width: 500, height: 500 });
  return section;
}
