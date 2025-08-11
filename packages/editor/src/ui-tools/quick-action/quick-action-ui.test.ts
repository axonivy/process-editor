import { IvyIcons } from '@axonivy/ui-icons';
import type { GModelRoot } from '@eclipse-glsp/client';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  assertMultiQuickActionUi,
  assertQuickAction,
  assertQuickActionUi,
  createContainer,
  createRoot,
  getQuickActionDiv,
  renderQuickActionUi
} from '../../test-utils/quick-action-ui.test-util';
import { QuickActionUI } from './quick-action-ui';

describe('QuickActionUi', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainer();
    quickActionUi = container.get<QuickActionUI>(QuickActionUI);
    root = createRoot(container);
  });

  test('hidden by default', async () => {
    const uiDiv = getQuickActionDiv();
    expect(uiDiv).toBeNull();
  });

  test('hidden if feature disabled', async () => {
    await renderQuickActionUi(quickActionUi, root, 'noQuickActions');
    assertQuickActionUi(0);
  });

  test('edges', async () => {
    await renderQuickActionUi(quickActionUi, root, 'edge');
    assertQuickActionUi(7);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Straighten (S)', IvyIcons.Straighten);
    assertQuickAction(3, 'Bend (B)', IvyIcons.Bend);
    assertQuickAction(4, 'Edit Label (L)', IvyIcons.Label);
    assertQuickAction(5, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(6, 'Reconnect (R)', IvyIcons.Reconnect);
  });

  test('activity', async () => {
    await renderQuickActionUi(quickActionUi, root, 'foo');
    assertQuickActionUi(8);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(3, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(7, 'Connect', IvyIcons.Connector);
  });

  test('embedded activity', async () => {
    await renderQuickActionUi(quickActionUi, root, 'sub');
    assertQuickActionUi(9);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);

    assertQuickAction(2, 'Jump (J)', IvyIcons.SubStart);
    assertQuickAction(4, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(8, 'Connect', IvyIcons.Connector);
  });

  test('event', async () => {
    await renderQuickActionUi(quickActionUi, root, 'start');
    assertQuickActionUi(7);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(6, 'Connect', IvyIcons.Connector);

    // no connection quick action if outgoing edge exists
    await renderQuickActionUi(quickActionUi, root, 'startWithConnection');
    assertQuickActionUi(6);
  });

  test('gateway', async () => {
    await renderQuickActionUi(quickActionUi, root, 'alternative');
    assertQuickActionUi(7);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(6, 'Connect', IvyIcons.Connector);

    // connection quick action even if outoging edge exists
    quickActionUi.show(root, 'alternativeWithConnection');
    assertQuickActionUi(7);
  });

  test('pool', async () => {
    await renderQuickActionUi(quickActionUi, root, 'pool');
    assertQuickActionUi(2);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Create Lane', IvyIcons.LaneSwimlanes);
  });

  test('lane', async () => {
    await renderQuickActionUi(quickActionUi, root, 'lane');
    assertQuickActionUi(2);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Select color', IvyIcons.ColorDrop);
  });

  test('multi selection', async () => {
    await renderQuickActionUi(quickActionUi, root, 'start', 'end');
    assertMultiQuickActionUi(4, { height: 40, width: 140 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Wrap to embedded process (W)', IvyIcons.WrapToSubprocess);
    assertQuickAction(2, 'Auto Align (A)', IvyIcons.AutoAlign);
    assertQuickAction(3, 'Select color', IvyIcons.ColorDrop);

    await renderQuickActionUi(quickActionUi, root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(4, { height: 140, width: 240 });
  });
});
