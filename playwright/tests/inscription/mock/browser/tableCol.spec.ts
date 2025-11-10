import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { openMockInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { browserBtn, code } from './browser-mock-utils';

test('browser add table column with all fields', async ({ page }) => {
  const inscriptionView = await openMockInscription(page, { type: 'Database' });
  const query = await selectAllFields(inscriptionView);

  const condition = query.section('Condition');
  await condition.expectIsClosed();
  await condition.open();
  const conditionField = condition.macroArea();
  await conditionField.focus();
  await applyTableColBrowser(page, 'Test ColumnString', 0, 2);
  await expect(code(page).getByRole('textbox')).toHaveValue('Test Column');
});

test('browser add table column with one field', async ({ page }) => {
  const inscriptionView = await openMockInscription(page, { type: 'Database' });
  const query = inscriptionView.inscriptionTab('Query');
  await query.open();
  const allFieldsCheckbox = query.checkbox('Select all fields');
  await allFieldsCheckbox.expectUnchecked();
  await page.getByRole('row').nth(1).click();

  const condition = query.section('Condition');
  await condition.expectIsClosed();
  await condition.open();
  const conditionField = condition.macroArea();
  await conditionField.focus();
  await applyTableColBrowser(page, 'Test ColumnString', 0, 1);
  await expect(code(page).getByRole('textbox')).toHaveValue('Test Column');
});

test('browser add table column doubleclick', async ({ page }) => {
  const inscriptionView = await openMockInscription(page, { type: 'Database' });
  const query = await selectAllFields(inscriptionView);

  const condition = query.section('Condition');
  await condition.expectIsClosed();
  await condition.open();
  const conditionField = condition.macroArea();
  await conditionField.focus();
  await applyTableColBrowser(page, 'Table Column', 0, undefined, true);
  await expect(code(page).getByRole('textbox')).toHaveValue('Test Column');
});

test('output', async ({ page }) => {
  const inscriptionView = await openMockInscription(page, { type: 'Database' });
  await selectAllFields(inscriptionView);
  const output = inscriptionView.inscriptionTab('Output');
  await output.open();

  const code = output.section('Code');
  await code.open();
  const codeBlock = code.scriptArea();
  await applyTableColBrowser(page, 'Table Column', 0, undefined, true);
  await codeBlock.expectValue('record.getField("Test Column") as TestIvyType');
});

async function selectAllFields(inscriptionView: Inscription) {
  const query = inscriptionView.inscriptionTab('Query');
  await query.open();
  const allFieldsCheckbox = query.checkbox('Select all fields');
  await allFieldsCheckbox.expectUnchecked();
  await allFieldsCheckbox.click();
  return query;
}

async function applyTableColBrowser(page: Page, expectedSelection: string = '', rowToCheck: number, numberOfRows?: number, dblClick?: boolean) {
  await browserBtn(page).nth(0).click();
  const browserDialog = page.getByRole('dialog');
  await expect(browserDialog).toBeVisible();
  await browserDialog.getByText('Table Column').first().click();

  if (dblClick) {
    await browserDialog.getByRole('row').nth(rowToCheck).click();
    await browserDialog.getByRole('row').nth(rowToCheck).dblclick();
  } else {
    if (numberOfRows) {
      await expect(browserDialog.getByRole('row')).toHaveCount(numberOfRows);
    }
    await browserDialog.getByRole('row').nth(rowToCheck).click();
    await expect(browserDialog.locator('.browser-helptext')).toHaveText(expectedSelection);
    await browserDialog.getByRole('button', { name: 'Apply' }).click();
  }

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(browserBtn(page).nth(0)).toBeVisible();
}
