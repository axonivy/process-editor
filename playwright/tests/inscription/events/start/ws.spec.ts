import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { CaseTest } from '../../parts/case';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { ResultTest } from '../../parts/result';
import { StartTest } from '../../parts/start';
import { WsStartTaskTest } from '../../parts/task';
import { WebServiceTest } from '../../parts/web-service';

test.describe('WS Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('WebserviceStart', { processKind: 'Web Service Process' });
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('WS Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Start', async () => {
    await runTest(view, StartTest);
  });

  test('Result', async () => {
    await runTest(view, ResultTest);
  });

  test('WebService', async () => {
    await runTest(view, WebServiceTest);
  });

  test('Task', async () => {
    await runTest(view, WsStartTaskTest);
  });

  test('Case', async () => {
    await runTest(view, CaseTest);
  });
});
