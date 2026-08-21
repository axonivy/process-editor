import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { ProcessEditor, resetEngine, runProcess } from '../../page-objects/editor/process-editor';

test('open history', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'webkit shows a ViewNotFoundException');
  const editor = await setupExecutions(page, context);
  const history = await editor.startElement.showHistory();
  await expect(history.title).toHaveText(`History of '148655DDB7BB6588-f0'`);
  await expect(history.table).toContainText('HTTP GET quickstart.p.json/start.ivp');

  const dialog = editor.elementByPid('148655DDB7BB6588-f3');
  await dialog.select();
  await expect(history.title).toHaveText(`History of '148655DDB7BB6588-f3'`);
  await expect(history.table).toContainText('HTTP GET quickstart.p.json/start.ivp');
  await expect(history.table).toContainText('in = Data');
  await expect(history.table).toContainText('price = null');

  const deepRows = history.table.getByRole('row', { name: /deep = Deep/ });
  await expect(deepRows).toHaveCount(1);
  await deepRows.first().getByLabel('Expand row').click();
  await expect(deepRows).toHaveCount(2);
  await deepRows.last().getByLabel('Expand row').click();
  await expect(deepRows).toHaveCount(3);
  await deepRows.last().getByLabel('Expand row').click();
  await expect(deepRows).toHaveCount(4);
  await deepRows.last().getByLabel('Expand row').click();
  await expect(deepRows).toHaveCount(4);
  await expect(history.table).toContainText('deep = null');

  await editor.startElement.select();
  await expect(deepRows).toHaveCount(0);

  await dialog.select();
  await expect(deepRows).toHaveCount(4);
});

test('pin history', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'webkit shows a ViewNotFoundException');
  const editor = await setupExecutions(page, context);
  const history = await editor.startElement.showHistory();
  await history.expectPopover();
  await history.pinButton.click();
  await history.expectPinned();

  await history.closeButton.click();
  await expect(history.pinned).toBeHidden();
  await expect(history.popover).toBeHidden();

  await editor.startElement.showHistory();
  await history.expectPinned();
  await history.pinButton.click();
  await history.expectPopover();
});

const setupExecutions = async (page: Page, context: BrowserContext) => {
  await resetEngine();
  const editor = await ProcessEditor.openProcess(page, { file: 'process/quickstart.p.json' });
  await runProcess(editor, context);
  return editor;
};
