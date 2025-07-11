import { IvyIcons } from '@axonivy/ui-icons';
import type { GModelRoot } from '@eclipse-glsp/client';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  assertMultiQuickActionUi,
  assertQuickAction,
  assertQuickActionUi,
  createContainer,
  createRoot,
  getQuickActionDiv
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

  test('hidden by default', () => {
    const uiDiv = getQuickActionDiv();
    expect(uiDiv).toBeNull();
  });

  test('hidden if feature disabled', () => {
    quickActionUi.show(root, 'noQuickActions');
    assertQuickActionUi(0);
  });

  test('edges', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(7, { x: 265, y: 215 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Straighten (S)', IvyIcons.Straighten);
    assertQuickAction(3, 'Bend (B)', IvyIcons.Bend);
    assertQuickAction(4, 'Edit Label (L)', IvyIcons.Label);
    assertQuickAction(5, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(6, 'Reconnect (R)', IvyIcons.Reconnect);
  });

  test('activity', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(8, { x: 200, y: 150 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(3, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(7, 'Connect', IvyIcons.Connector);
  });

  test('embedded activity', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(9, { x: 400, y: 150 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);

    assertQuickAction(2, 'Jump (J)', IvyIcons.SubStart);
    assertQuickAction(4, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(8, 'Connect', IvyIcons.Connector);
  });

  test('event', () => {
    quickActionUi.show(root, 'start');
    assertQuickActionUi(7, { x: 215, y: 230 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(6, 'Connect', IvyIcons.Connector);

    // no connection quick action if outgoing edge exists
    quickActionUi.show(root, 'startWithConnection');
    assertQuickActionUi(6);
  });

  test('gateway', () => {
    quickActionUi.show(root, 'alternative');
    assertQuickActionUi(7, { x: 116, y: 232 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(6, 'Connect', IvyIcons.Connector);

    // connection quick action even if outoging edge exists
    quickActionUi.show(root, 'alternativeWithConnection');
    assertQuickActionUi(7);
  });

  test('pool', () => {
    quickActionUi.show(root, 'pool');
    assertQuickActionUi(2, { x: 250, y: 100 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Create Lane', IvyIcons.LaneSwimlanes);
  });

  test('lane', () => {
    quickActionUi.show(root, 'lane');
    assertQuickActionUi(2, { x: 250, y: 200 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Select color', IvyIcons.ColorDrop);
  });

  test('multi selection', () => {
    quickActionUi.show(root, 'start', 'end');
    assertMultiQuickActionUi(4, { height: 40, width: 140 }, { x: 265, y: 230 });
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Wrap to embedded process (W)', IvyIcons.WrapToSubprocess);
    assertQuickAction(2, 'Auto Align (A)', IvyIcons.AutoAlign);
    assertQuickAction(3, 'Select color', IvyIcons.ColorDrop);

    quickActionUi.show(root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(4, { height: 140, width: 240 }, { x: 215, y: 230 });
  });
});
