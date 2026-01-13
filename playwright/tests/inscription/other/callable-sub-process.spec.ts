import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../page-objects/inscription/inscription-view';
import { GeneralTestWithDisabledName } from '../parts/name';
import { runTest } from '../parts/part-tester';
import { PermissionsTest } from '../parts/permissions';
import { ProcessDataTest } from '../parts/process-data';

test.describe('Callable Sub Process', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('Database', { processKind: 'Callable Sub Process' });
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.processId);
  });

  test('Header', async () => {
    await view.expectHeaderText(testee.processUUID);
  });

  test('General', async () => {
    await runTest(view, GeneralTestWithDisabledName);
  });

  test('Process Data', async () => {
    await runTest(view, ProcessDataTest);
  });

  test('Permissions', async () => {
    await runTest(view, PermissionsTest());
  });
});
