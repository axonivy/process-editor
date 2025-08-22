import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { graphLocator } from '../../page-objects/editor/graph';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import type { ElementPaletteGroup } from '../../page-objects/editor/toolbar';

export async function createAllElements(
  page: Page,
  btn: ElementPaletteGroup,
  groupIndex: number,
  expectedElementCount: number,
  checkSelection = true
) {
  const processEditor = await ProcessEditor.openEmptyProcess(page);
  await processEditor.toolbar().openElementPalette(btn);
  const menu = processEditor.toolbar().menu().locator();

  const graph = graphLocator(page);
  const elements = graph.locator('> g > g:not(.negative-area-group)');
  const pickers = menu.locator('.ui-palette-section').nth(groupIndex).locator('.ui-palette-item');
  const pickersCount = await pickers.count();
  for (let i = 0; i < pickersCount; i++) {
    await pickers.nth(i).click();
    await graph.click({ position: { x: 80 + 80 * i, y: 100 } });
    await expect(elements).toHaveCount(i + 1);
    if (checkSelection) {
      await expect(elements.last()).toHaveAttribute('class', /selected/);
    }
    await processEditor.resetSelection();
    await processEditor.toolbar().openElementPalette(btn);
  }
  await expect(elements).toHaveCount(expectedElementCount);
}
