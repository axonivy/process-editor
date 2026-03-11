import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { app, pmv, ProcessEditor, server } from '../../page-objects/editor/process-editor';

test('open history', async ({ page, context }) => {
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

test('pin history', async ({ page, context }) => {
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
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/quickstart.p.json' });
  const pagePromise = context.waitForEvent('page');
  await editor.startElement.quickActionBar().trigger('Start Process', 'startsWith');
  const newPage = await pagePromise;
  await expect(newPage.locator('#iFrameForm\\:frameTaskName')).toContainText('Task:', { timeout: 10000 });
  await newPage.close();
  await expect(editor.startElement.executionBadge).toBeVisible();
  return editor;
};

const resetEngine = async () =>
  fetch(`${server}/api/web-ide/project/stop-bpm-engine?app=${app}&pmv=${pmv}`, {
    method: 'POST',
    headers: {
      'X-Requested-By': 'ivy-process-editor-test'
    }
  });
