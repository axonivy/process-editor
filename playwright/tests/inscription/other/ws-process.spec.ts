import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../page-objects/inscription/inscription-view';
import { GeneralTestWithDisabledName } from '../parts/name';
import { runTest } from '../parts/part-tester';
import { PermissionsTest } from '../parts/permissions';
import { ProcessDataTest } from '../parts/process-data';
import { WebServiceProcessTest } from '../parts/web-service-process';

test.describe('Web Service Process', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('WebserviceStart', { processKind: 'Web Service Process' });
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

  test('Web Service Process', async () => {
    await runTest(view, WebServiceProcessTest);
  });

  test('Process Data', async () => {
    await runTest(view, ProcessDataTest);
  });

  test('Permissions', async () => {
    await runTest(view, PermissionsTest());
  });
});
