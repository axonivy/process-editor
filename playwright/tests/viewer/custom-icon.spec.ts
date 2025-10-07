import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../page-objects/editor/process-editor';

test('show custom icons', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/market/UserEnroll.p.json' });
  await expect(editor.element('subProcessCall').icon).toBeVisible();
  await expect(editor.element('subProcessCall').icon.locator('img')).toHaveAttribute('src', /user.png/);
});
