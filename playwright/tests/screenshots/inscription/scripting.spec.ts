import { test, type Page } from '@playwright/test';
import { screenshot } from './screenshot-util';
import { openElementInscription } from '../../page-objects/inscription/inscription-view';
import type { InscriptionTab } from '../../page-objects/inscription/inscription-tab';

const GENERIC_PID = {
  SCRIPT: '168F0C6DF682858E-f3',
  USER_TASK: '168F0C6DF682858E-f5'
} as const;

test.describe('Scripting', () => {
  test('Completion', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    const inscriptionTab = await openInscriptionTab(page, GENERIC_PID.SCRIPT, 'Output');
    const section = await codeOnly(inscriptionTab);
    const script = section.scriptArea();

    await script.fill('ivy.');
    await script.triggerContentAssist();
    await screenshot(section.currentLocator(), 'code-completor.png');
  });

  test('Hopping', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    const inscriptionTab = await openInscriptionTab(page, GENERIC_PID.SCRIPT, 'Output');
    const section = await codeOnly(inscriptionTab);
    const script = section.scriptArea();

    await script.fill('in.set');
    await script.triggerContentAssist();
    await page.keyboard.press('Enter');

    await screenshot(section.currentLocator(), 'code-param-hopping.png');
  });

  test('Macro', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 600 });
    const inscriptionTab = await openInscriptionTab(page, GENERIC_PID.USER_TASK, 'Task');
    const section = inscriptionTab.section('Details');
    await section.open();
    const script = section.macroArea('Name');

    await script.fill('Verify User <%= ');
    await script.focus();
    await page.keyboard.press('ArrowLeft+ArrowLeft+ArrowLeft');
    await page.keyboard.type('in.');

    await screenshot(section.currentLocator(), 'code-macro.png');
  });
});

async function openInscriptionTab(page: Page, pid: string, inscriptionTabName): Promise<InscriptionTab> {
  const view = await openElementInscription(page, pid, 'inscription-test-project');
  await page.addStyleTag({ content: 'body { overflow: hidden; }' });
  const tab = view.inscriptionTab(inscriptionTabName);
  await tab.open();
  return tab;
}

async function codeOnly(inscriptionTab: InscriptionTab) {
  await inscriptionTab.section('Mapping').close();
  const section = inscriptionTab.section('Code');
  await section.open();
  return section;
}
