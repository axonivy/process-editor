import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('root lane actions', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const lane = await processEditor.createLane({ x: 10, y: 60 });
  await lane.quickActionBar().count(0);
  await lane.select();
  await lane.quickActionBar().count(3);
});

test('root lane label', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const lane = await processEditor.createLane({ x: 10, y: 60 });
  const labelEdit = await lane.quickActionBar().editLabel();
  await labelEdit.edit('Test label');
  await lane.expectLabel('Test label');
});

test('root lane delete', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const lane = await processEditor.createLane({ x: 10, y: 60 });
  await lane.quickActionBar().trigger('Delete');
  await expect(lane.locator()).toBeHidden();
});

test('pool actions', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const pool = await processEditor.createPool({ x: 10, y: 60 });
  await pool.quickActionBar().count(0);
  await pool.select();
  await pool.quickActionBar().count(3);
});

test('pool label', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const pool = await processEditor.createPool({ x: 10, y: 60 });
  const processName = page.url().substring(page.url().lastIndexOf('/') + 1, page.url().lastIndexOf('.p.json'));
  await pool.expectLabel(processName);

  const labelEdit = await pool.quickActionBar().editLabel();
  await labelEdit.edit('Test label');
  await pool.expectLabel('Test label');
});

test('pool delete', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const pool = await processEditor.createPool({ x: 10, y: 60 });
  await pool.quickActionBar().trigger('Delete');
  await expect(pool.locator()).toBeHidden();
});

test('pool add and remove embedded lanes', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const pool = await processEditor.createPool({ x: 10, y: 60 });
  const lane1 = await pool.createEmbeddedLane();
  await pool.expectEmbeddedLanes(1);
  await pool.createEmbeddedLane();
  await pool.expectEmbeddedLanes(2);

  await lane1.quickActionBar().trigger('Delete');
  await pool.expectEmbeddedLanes(1);
  await pool.quickActionBar().trigger('Delete');
  await expect(pool.locator()).toBeHidden();
});
