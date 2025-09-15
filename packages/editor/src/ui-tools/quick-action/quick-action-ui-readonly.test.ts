import type { GModelRoot } from '@eclipse-glsp/client';
import { TYPES } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import { beforeAll, describe, test } from 'vitest';
import type { IvyViewerOptions } from '../../options';
import {
  assertQuickAction,
  assertQuickActionUi,
  createContainer,
  createRoot,
  renderQuickActionUi
} from '../../test-utils/quick-action-ui.test-util';
import ivyQuickActionModule, { configureQuickActionProviders } from './di.config';
import { QuickActionUI } from './quick-action-ui';

class QuickActionUIReadonly extends QuickActionUI {
  protected override isReadonly(): boolean {
    return true;
  }
}

function createContainerReadonly(options?: Partial<IvyViewerOptions>): Container {
  const container = createContainer(options);
  container.unload(ivyQuickActionModule);
  container.bind(QuickActionUIReadonly).toSelf().inSingletonScope();
  container.bind(TYPES.IUIExtension).toService(QuickActionUIReadonly);
  configureQuickActionProviders(container);
  return container;
}

describe('QuickActionUi - Readonly (hide sensitive infos)', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainerReadonly({ hideSensitiveInfo: true });
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  test('activity', async () => {
    await renderQuickActionUi(quickActionUi, root, 'foo');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });

  test('edge', async () => {
    await renderQuickActionUi(quickActionUi, root, 'edge');
    assertQuickActionUi(0);
  });
});

describe('QuickActionUi - Readonly', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainerReadonly();
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  test('activity', async () => {
    await renderQuickActionUi(quickActionUi, root, 'foo');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });

  test('embedded activity', async () => {
    await renderQuickActionUi(quickActionUi, root, 'sub');
    assertQuickActionUi(2);
    assertQuickAction(0, 'Information (I)');
    assertQuickAction(1, 'Jump (J)');
  });

  test('edge', async () => {
    await renderQuickActionUi(quickActionUi, root, 'edge');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });
});
