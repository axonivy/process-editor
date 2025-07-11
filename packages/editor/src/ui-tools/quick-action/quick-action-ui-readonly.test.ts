import type { GModelRoot } from '@eclipse-glsp/client';
import { TYPES } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import { beforeAll, describe, test } from 'vitest';
import type { IvyViewerOptions } from '../../options';
import { assertQuickAction, assertQuickActionUi, createContainer, createRoot } from '../../test-utils/quick-action-ui.test-util';
import ivyQuickActionModule, { configureQuickActionProviders } from './di.config';
import { QuickActionUI } from './quick-action-ui';

class QuickActionUIReadonly extends QuickActionUI {
  protected isReadonly(): boolean {
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

describe('QuickActionUi - Readonly', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainerReadonly();
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  test('activity', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });

  test('embedded activity', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(2, { x: 400, y: 150 });
    assertQuickAction(0, 'Information (I)');
    assertQuickAction(1, 'Jump (J)');
  });

  test('edge', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });
});

describe('QuickActionUi - Readonly (hide sensitive infos)', () => {
  let quickActionUi: QuickActionUI;
  let root: GModelRoot;

  beforeAll(() => {
    const container = createContainerReadonly({ hideSensitiveInfo: true });
    quickActionUi = container.get<QuickActionUI>(QuickActionUIReadonly);
    root = createRoot(container);
  });

  test('activity', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(1);
    assertQuickAction(0, 'Information (I)');
  });

  test('edge', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(0);
  });
});
