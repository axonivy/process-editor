import { test } from '@playwright/test';
import type { Menu } from '../../page-objects/editor/menu';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import type { Toolbar } from '../../page-objects/editor/toolbar';

test('menus show / hide', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const toolbar = processEditor.toolbar();
  await assertNoOpenMenu(toolbar);
  await toolbar.triggerOptions();
  await assertMenu(toolbar.options(), toolbar.menu());

  await toolbar.triggerOptions();
  await assertNoOpenMenu(toolbar);
  await toolbar.triggerOptions();
  await toolbar.triggerElementPalette('events');
  await toolbar.triggerElementPalette('gateways');
  await assertMenu(toolbar.menu(), toolbar.options());

  await toolbar.triggerElementPalette('gateways');
  await assertNoOpenMenu(toolbar);
});

test('menus close on focus loose', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const toolbar = processEditor.toolbar();
  const start = processEditor.startElement;
  await assertNoOpenMenu(toolbar);

  await toolbar.triggerOptions();
  await assertMenu(toolbar.options(), toolbar.menu());

  await start.select();
  await assertNoOpenMenu(toolbar);

  await toolbar.triggerElementPalette('events');
  await assertMenu(toolbar.menu(), toolbar.options());

  await processEditor.resetSelection();
  await assertNoOpenMenu(toolbar);
});

async function assertNoOpenMenu(toolbar: Toolbar) {
  await toolbar.expectActiveButton('default_tools');
  await toolbar.options().expectHidden();
  await toolbar.menu().expectHidden();
}

async function assertMenu(openMenu: Menu, closedMenu: Menu) {
  await openMenu.expectVisible();
  await closedMenu.expectHidden();
}
