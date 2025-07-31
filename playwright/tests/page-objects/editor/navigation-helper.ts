import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ProcessEditor } from './process-editor';

export async function jumpToExternalTargetAndAssert(
  page: Page,
  elementPid: string,
  expectedProcessPid: string,
  expectedElementPid: string
): Promise<void> {
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/jump.p.json' });
  const element = processEditor.elementByPid(elementPid);
  await element.quickActionBar().trigger('Jump', 'startsWith');
  await expect(element.locator()).toBeHidden();
  await page.waitForLoadState();
  expect(page.url()).toContain('pmv=process-test-project');
  expect(page.url()).toContain(`pid=${expectedProcessPid}`);
  expect(page.url()).toContain(`select=${expectedElementPid}`);
  await processEditor.elementByPid(expectedElementPid).expectSelected();
}
