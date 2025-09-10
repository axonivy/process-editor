import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('outline', async ({ page }) => {
  const { outline } = await openOutline(page, 'processes/quickstart.p.json');
  await outline.view.getByRole('row').all();
  const rows = await outline.view.getByRole('row').all();
  await expect(rows[0]!).toHaveText('quickstartBusiness Process');
  await expect(rows[1]!).toHaveText('User DialogEnter Product');
  await expect(rows[2]!).toHaveText('End148655DDB7BB6588-f1');
  await expect(rows[3]!).toHaveText('End148655DDB7BB6588-f7');
  await expect(rows[4]!).toHaveText('Startstart.ivp');
  await expect(rows[5]!).toHaveText('AlternativePrice higher than 100?');
});

test('select element', async ({ page }) => {
  const { processEditor, outline } = await openOutline(page);
  await processEditor.endElement.select();
  await outline.expectSelected('End');

  await processEditor.startElement.select();
  await outline.expectSelected('Start');
});

test('select node', async ({ page }) => {
  const { processEditor, outline } = await openOutline(page, 'processes/jump.p.json');
  const embeddedScript = processEditor.elementByPid('183E4A356E771204-S10-f9');
  const call = processEditor.elementByPid('183E4A356E771204-f6');
  const trigger = processEditor.elementByPid('183E4A356E771204-f3');
  await outline.select('Trigger');
  await trigger.expectSelected();

  await outline.select('Script');
  await embeddedScript.expectSelected();

  await outline.select('Call');
  await outline.doubleClick('Call');
  await call.expectSelected();
  await expect(embeddedScript.locator()).toBeHidden();
  await outline.expectClosed();
});

const openOutline = async (page: Page, file?: string) => {
  const processEditor = await ProcessEditor.openProcess(page, { file });
  const inscription = await processEditor.startElement.inscribe();
  const outline = await inscription.toggleOutline();
  return { processEditor, inscription, outline };
};
