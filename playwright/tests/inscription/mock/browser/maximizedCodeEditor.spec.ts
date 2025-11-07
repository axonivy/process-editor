import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../../page-objects/inscription/inscription-view';
import { assertCodeVisible, code } from './browser-mock-utils';

test('maximized code editor', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  await page.getByText('Code').click();
  const codeField = task.scriptArea();
  await codeField.focus();
  await assertCodeVisible(page);
  //check if value is transfered to maximized code editor
  await codeField.fill('test');
  const maximizedButton = page.getByRole('button', { name: 'Fullsize Code Editor' });
  await maximizedButton.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const maximizedCodeEditor = code(page);
  await expect(maximizedCodeEditor.getByRole('textbox')).toHaveValue('test');
  //check if value is transfered to minimized code editor
  await maximizedCodeEditor.click();
  await page.keyboard.type('hello');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(code(page).getByRole('textbox')).toHaveValue('testhello');

  await codeField.fill('test123');
  await maximizedButton.click();
  await expect(maximizedCodeEditor.getByRole('textbox')).toHaveValue('test123');
  await maximizedCodeEditor.click();
  await page.keyboard.type('hello');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(code(page).getByRole('textbox')).toHaveValue('test123');
});

test('maximized code editor in table cell', async ({ page }) => {
  const inscriptionView = await openMockInscription(page, { type: 'Alternative' });
  const condition = inscriptionView.inscriptionTab('Condition');
  await condition.open();
  const conditionSection = condition.section('Condition');
  await conditionSection.expectIsOpen();
  const conditionTable = conditionSection.table(['label', 'expression']);
  const conditionCell = conditionTable.row(1).column(1).scriptCell;
  //check if value is transfered to maximized code editor
  await conditionCell.fill('test');
  const fullScreen = await conditionCell.openFullScreen();
  const maximizedCodeEditor = code(fullScreen.dialog);
  await expect(maximizedCodeEditor.getByRole('textbox')).toHaveValue('test');
  //check if value is transfered to minimized code editor
  await maximizedCodeEditor.click();
  await page.keyboard.type('hello');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await conditionCell.expectValue('testhello');
  //check is saved
  await conditionSection.close();
  await conditionSection.open();
  await conditionCell.expectValue('testhello');
});
