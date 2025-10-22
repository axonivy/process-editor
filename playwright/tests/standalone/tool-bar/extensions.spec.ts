import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('extensions with entries', async ({ page }) => {
  const editor = await ProcessEditor.openEmptyProcess(page);
  await editor.toolbar().openElementPalette('extensions');
  const menu = editor.toolbar().menu();

  await menu.expectGroups(['Rest Clients', 'Callable Sub Processes', 'Program Elements']);
  const restGroup = menu.group('Rest Clients');
  const callableGroup = menu.group('Callable Sub Processes');
  const programGroup = menu.group('Program Elements');
  await expect(menu.items(restGroup)).toHaveCount(2);
  await expect(menu.items(callableGroup)).toHaveCount(3);
  await expect(menu.items(programGroup)).toHaveCount(1);

  const genderizeItem = menu.items(restGroup).nth(0);
  await expect(genderizeItem).toContainText('genderizehttp://localhost/');
  await expect(genderizeItem.locator('img')).toHaveAttribute('src', /javax.faces.resource\/icons\/genderize.png/);
  const testItem = menu.items(restGroup).nth(1);
  await expect(testItem).toContainText('testhttp://localhost/');
  const subProcItem = menu.items(callableGroup).nth(1);
  await expect(subProcItem).toContainText('subproc');
  const subWithIconItem = menu.items(callableGroup).nth(2);
  await expect(subWithIconItem).toContainText('subWithIcon');
  await expect(subWithIconItem.locator('img')).toHaveAttribute('src', /javax.faces.resource\/icons\/Developer.jpg/);

  await menu.search('gen');
  await expect(menu.items()).toHaveCount(1);
  await menu.items().first().click();
  await editor.graph.click({ position: { x: 160, y: 100 } });
  await editor.element('restClientCall').expectLabel('genderize');
});
