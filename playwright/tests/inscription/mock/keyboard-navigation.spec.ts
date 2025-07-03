import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Keyboard Navigation', () => {
  test('navigate through script-input/areas', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const taskPart = inscriptionView.inscriptionTab('Task');
    await taskPart.open();
    const detailsSection = taskPart.section('Name / Description');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await detailsSection.macroInput('Name').expectCodeFocused();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await detailsSection.macroArea('Description').expectCodeFocused();

    await page.keyboard.press('Tab');
    await detailsSection.macroArea('Description').expectCodeFocused();
    await page.keyboard.press('Escape');
    await detailsSection.macroArea('Description').expectBrowserButtonFocused();

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await detailsSection.macroInput('Name').expectCodeFocused();
  });

  test('navigate through code-block', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const taskPart = inscriptionView.inscriptionTab('Output');
    await taskPart.open();
    const codeSection = taskPart.section('Code');
    await codeSection.toggle();
    await codeSection.scriptArea().focus();
    await expect(page.locator('textarea.inputarea.monaco-mouse-cursor-text')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('textarea.inputarea.monaco-mouse-cursor-text')).toBeFocused();

    await page.keyboard.press('Escape');
    await codeSection.scriptArea().expectBrowserButtonFocused();

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Fullsize Code Editor' })).toBeFocused();
  });
});
