import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { expectCodeInEditor } from '../../../page-objects/inscription/code-editor';
import { openMockInscription } from '../../../page-objects/inscription/inscription-view';
import { assertCodeHidden, assertCodeVisible, browserBtn, code } from './browser-mock-utils';

test('browser init searchfilter', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Dialog');
  await task.open();

  const codeSection = task.section('Code');
  await codeSection.open();
  const codeField = codeSection.scriptArea();
  await codeField.fill('handle');

  await code(page).dblclick();
  await browserBtn(page).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByText('Type').last().click();

  await expect(page.getByPlaceholder('Search')).toHaveValue('handle');
});

test('browser add type', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  await task.section('Expiry').open();
  const timeout = task.macroArea('Timeout');
  await assertCodeHidden(page);
  await timeout.activate();
  await assertCodeVisible(page);

  await applyTypeBrowser(page, 2, 'ch.ivyteam.test.Person');
  await expectCodeInEditor(code(page), 'ch.ivyteam.test.Person');
});

test('browser add type as list', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  await task.section('Expiry').open();
  const timeout = task.macroArea('Timeout');
  await assertCodeHidden(page);
  await timeout.activate();
  await assertCodeVisible(page);

  await applyTypeBrowser(page, 2, 'ch.ivyteam.test.Person', true);
  await expectCodeInEditor(code(page), 'List<ch.ivyteam.test.Person>');
});

test('browser add type doubleclick', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  await task.section('Expiry').open();
  const timeout = task.macroArea('Timeout');
  await assertCodeHidden(page);
  await timeout.activate();
  await assertCodeVisible(page);

  await applyTypeBrowser(page, 2, undefined, undefined, true);
  await expectCodeInEditor(code(page), 'ch.ivyteam.test.Person');
});

async function applyTypeBrowser(page: Page, rowToCheck: number, expectedSelection: string = '', checkListGeneric?: boolean, dblClick?: boolean) {
  await browserBtn(page).nth(0).click();
  const browserDialog = page.getByRole('dialog');
  await expect(browserDialog).toBeVisible();
  await browserDialog.getByText('Type').first().click();
  await browserDialog.getByRole('row').nth(rowToCheck).click();

  if (dblClick) {
    await browserDialog.getByRole('row').nth(rowToCheck).dblclick();
  } else {
    if (checkListGeneric) {
      await browserDialog.getByLabel('Use Type as List').click();
      await expect(browserDialog.locator('.browser-helptext')).toHaveText('List<' + expectedSelection + '>');
    } else {
      await expect(browserDialog.locator('.browser-helptext')).toHaveText(expectedSelection);
    }
    await browserDialog.getByRole('button', { name: 'Apply' }).click();
  }

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(browserBtn(page).nth(0)).toBeVisible();
}
