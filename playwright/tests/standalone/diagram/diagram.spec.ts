import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('diagram', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const toolPalette = processEditor.toolbar();
  await toolPalette.visible();
});

test('problem marker', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/empty.p.json' });
  const hd = await editor.createActivity('User Dialog');
  await hd.expectHasWarning();

  await hd.quickActionBar().trigger('Wrap', 'startsWith');
  const sub = editor.element('embeddedProcessElement');
  await sub.expectHasWarning();

  await sub.quickActionBar().trigger('Jump', 'startsWith');
  const subHd = editor.element('dialogCall');
  await subHd.expectHasWarning();

  await subHd.quickActionBar().trigger('Wrap', 'startsWith');
  const subSub = editor.element('embeddedProcessElement');
  await subSub.expectHasWarning();

  await editor.jumpOut().click();
  await sub.expectHasWarning();
  await sub.delete();
  await expect(sub.locator()).toBeHidden();
});
