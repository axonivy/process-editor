import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('toggle theme', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await processEditor.expectLightMode();

  await processEditor.toolbar().openOptionsMenu();
  await processEditor.toolbar().options().toggleOption('Theme', false);
  await processEditor.expectDarkMode();

  await processEditor.toolbar().options().toggleOption('Theme', true);
  await processEditor.expectLightMode();
});

test('toggle grid', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await processEditor.expectGridHidden();

  await processEditor.toolbar().openOptionsMenu();
  await processEditor.toolbar().options().toggleOption('Grid', false);
  await processEditor.expectGridVisible();

  await processEditor.toolbar().options().toggleOption('Grid', true);
  await processEditor.expectGridHidden();
});

test('toggle custom icons', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/market/UserEnroll.p.json' });
  await expect(editor.element('subProcessCall').icon).toBeVisible();
  await expect(editor.element('subProcessCall').icon.locator('img')).toHaveAttribute('src', /user.png/);

  await editor.toolbar().openOptionsMenu();
  await editor.toolbar().options().toggleOption('Custom Icon', true);
  await expect(editor.element('subProcessCall').icon).toBeHidden();

  await editor.toolbar().options().toggleOption('Custom Icon', false);
  await expect(editor.element('subProcessCall').icon).toBeVisible();
});
