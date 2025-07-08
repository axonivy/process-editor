import test, { expect } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import { SearchPalette } from '../../page-objects/editor/search-palette';

test('focus tool bar shortcut', async ({ page }) => {
  await ProcessEditor.openProcess(page);
  const defaultToolsButton = page.locator('#btn_default_tools');
  await expect(defaultToolsButton).not.toBeFocused();
  await page.keyboard.press('Digit1');
  await expect(defaultToolsButton).toBeFocused();
});

test('focus diagram shortcut', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  await expect(editor.diagram).not.toBeFocused();
  await editor.focusDiagramAndCheck();
  await editor.startElement.expectSelected();
  await editor.endElement.select();
  await editor.focusDiagramAndCheck();
  await editor.endElement.expectSelected();
  await editor.startElement.expectNotSelected();
});

test('toggle and focus inscription shortcut', async ({ page }) => {
  const inscription = (await ProcessEditor.openProcess(page)).inscription();
  await inscription.expectClosed();
  await page.keyboard.press('Digit3');
  await inscription.expectOpen();
  await page.keyboard.press('Digit3');
  await page.waitForFunction(() => {
    return document.activeElement?.getAttribute('aria-label') === 'General';
  });
  await expect(inscription.inscriptionTab('General').tabButtonLocator).toBeFocused();
});

test('do not change focus if input is focused', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  const inscription = await editor.startElement.inscribe();
  await inscription.inscriptionTab('General').open();
  const input = inscription.view.getByLabel('Display name');
  await input.focus();
  await expect(input).toBeFocused();
  await page.keyboard.press('Digit1');
  await page.keyboard.press('Digit2');
  await page.keyboard.press('Digit3');
  await expect(input).toContainText('123');
  await expect(input).toBeFocused();
});

test('resize inscription shortcut', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  const inscriptionView = (await editor.startElement.inscribe()).view;
  await inscriptionView.locator('div.inscription-resizer').focus();
  await expect(inscriptionView).toHaveCSS('width', /426./);
  await page.keyboard.press('ArrowLeft');
  await expect(inscriptionView).toHaveCSS('width', /427./);
  await page.keyboard.press('ArrowRight');
  await expect(inscriptionView).toHaveCSS('width', /426./);
});

test('element search palette', async ({ page, browserName }) => {
  const editor = await ProcessEditor.openProcess(page);
  const searchPalette = new SearchPalette(page);
  await searchPalette.expectHidden();
  await editor.focusDiagramAndCheck();
  await editor.endElement.expectNotSelected();
  await searchPalette.openAndAssertVisible(browserName);
  const startSuggestion = searchPalette.suggestion('[event:start:requestStart] - start');
  const endSuggestion = searchPalette.suggestion('[event:end:taskEnd]');
  const edgeSuggestion = searchPalette.suggestion('[edge] - event:start:requestStart -> event:end:taskEnd');
  await expect(startSuggestion).toBeVisible();
  await expect(endSuggestion).toBeVisible();
  await expect(edgeSuggestion).toBeVisible();
  await searchPalette.searchField.fill('end');
  await expect(startSuggestion).toBeHidden();
  await expect(endSuggestion).toBeVisible();
  await expect(edgeSuggestion).toBeVisible();
  await endSuggestion.click();
  await searchPalette.expectHidden();
  await editor.endElement.expectSelected();
});

test('element navigation mode', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  await editor.startElement.select();
  await page.keyboard.press('N');
  await expect(editor.toast).toContainText('Navigation On:');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await editor.endElement.expectSelected();
  await page.keyboard.press('Escape');
  await expect(editor.toast).toContainText('Navigation Off:');
});
