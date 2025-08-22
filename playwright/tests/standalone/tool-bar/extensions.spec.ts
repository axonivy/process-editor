import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('extensions with entries', async ({ page }) => {
  const editor = await ProcessEditor.openEmptyProcess(page);
  await editor.toolbar().openElementPalette('extensions');
  const menu = editor.toolbar().menu();

  await menu.expectMenuGroups(['Rest Clients', 'Callable Sub Processes']);
  await menu.expectMenuItemCount(5);
  const items = menu.locator().locator('.ui-palette-item');
  await expect(items.nth(0)).toContainText('genderizehttp://localhost/');
  await expect(items.nth(0).locator('img')).toHaveAttribute('src', /javax.faces.resource\/icons\/genderize.png/);
  await expect(items.nth(1)).toContainText('testhttp://localhost/');
  await expect(items.nth(3)).toContainText('subproc');
  await expect(items.nth(4)).toContainText('subWithIcon');
  await expect(items.nth(4).locator('img')).toHaveAttribute('src', /javax.faces.resource\/icons\/Developer.jpg/);

  await menu.search('gen');
  await menu.expectMenuItemCount(1);
  await items.first().click();
  await editor.graph.click({ position: { x: 160, y: 100 } });
  await editor.element('restClientCall').expectLabel('genderize');
});
