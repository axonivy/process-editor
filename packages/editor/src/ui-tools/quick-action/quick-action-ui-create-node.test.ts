import { IvyIcons } from '@axonivy/ui-icons';
import type { GModelRoot } from '@eclipse-glsp/client';
import { EnableToolPaletteAction, configureActionHandler } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import { beforeAll, describe, test } from 'vitest';
import {
  assertQuickAction,
  assertQuickActionUi,
  createContainer,
  createRoot,
  renderQuickActionUi
} from '../../test-utils/quick-action-ui.test-util';
import ivyToolBarModule from '../tool-bar/di.config';
import { ElementsPaletteHandler } from '../tool-bar/node/action-handler';
import { QuickActionUI } from './quick-action-ui';

function createNodeContainer(): Container {
  const container = createContainer();
  container.unload(ivyToolBarModule);
  configureActionHandler(container, EnableToolPaletteAction.KIND, ElementsPaletteHandler);
  return container;
}

describe('QuickActionUi - Create Nodes', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createNodeContainer();
    quickActionUi = container.get<QuickActionUI>(QuickActionUI);
    root = createRoot(container);
  });

  test('activity', async () => {
    await renderQuickActionUi(quickActionUi, root, 'foo');
    assertQuickActionUi(8);
    assertQuickAction(0, 'Delete', IvyIcons.Trash);
    assertQuickAction(1, 'Information (I)', IvyIcons.InfoCircle);
    assertQuickAction(2, 'Wrap to embedded process (W)', IvyIcons.WrapToSubprocess);
    assertQuickAction(3, 'Select color', IvyIcons.ColorDrop);
    assertQuickAction(4, 'Events (A)', IvyIcons.Start);
    assertQuickAction(5, 'Gateways (A)', IvyIcons.GatewaysGroup);
    assertQuickAction(6, 'Activities (A)', IvyIcons.ActivitiesGroup);
    assertQuickAction(7, 'Connect', IvyIcons.Connector);
  });

  test('hidden for comment', async () => {
    await renderQuickActionUi(quickActionUi, root, 'comment');

    assertQuickActionUi(5);
    assertQuickAction(0, 'Delete');
    assertQuickAction(3, 'Select color');
    assertQuickAction(4, 'Connect');
  });

  test('hidden for end event', async () => {
    await renderQuickActionUi(quickActionUi, root, 'end');
    assertQuickActionUi(3);
    assertQuickAction(0, 'Delete');
    assertQuickAction(2, 'Select color');
  });
});
