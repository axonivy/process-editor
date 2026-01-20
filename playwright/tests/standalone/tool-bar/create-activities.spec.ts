import { test } from '@playwright/test';
import { createAllElements } from './create-helper';

test('create all workflow activities', async ({ page }) => {
  await createAllElements(page, 'activities', 0, 5);
});

test('create all interface activities', async ({ page }) => {
  await createAllElements(page, 'activities', 1, 5);
});

test('create all bpmn activities', async ({ page }) => {
  await createAllElements(page, 'activities', 2, 8);
});
