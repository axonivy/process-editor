import type { ActionDispatcher, FeedbackActionDispatcher } from '@eclipse-glsp/client';
import { Bounds, CenterCommand, configureActionHandler, configureCommand, InitializeCanvasBoundsAction, TYPES } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import { beforeEach, describe, expect, test } from 'vitest';

import { AnimateAction } from '@axonivy/process-editor-protocol';
import { MoveIntoViewportCommand } from '../ui-tools/viewport/viewport-commands';
import { createTestContainer } from '../utils/test-utils';
import { AnimateActionHandler } from './animate-action-handler';
import type { AnimateFeedbackAction } from './animate-feedback-action';
import { AnimateFeedbackCommand } from './animate-feedback-action';

function createContainer(): Container {
  const container = createTestContainer();
  container.bind(AnimateActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, AnimateAction.KIND, AnimateActionHandler);
  configureCommand(container, AnimateFeedbackCommand);
  configureCommand(container, CenterCommand);
  configureCommand(container, MoveIntoViewportCommand);
  return container;
}

describe('AnimateActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  test('Action handler registers the correct AnimateFeedbackAction', async () => {
    await actionDispatcher.dispatch(AnimateAction.create({ elementIds: ['foo'] }));
    const action = getAndAssertFeedbackAction();
    expect(action.animatedIDs).to.include('foo');
    expect(action.deAnimatedIDs).toBeUndefined();

    await new Promise(r => setTimeout(r, 2100));
    expect(feedbackDispatcher.getRegisteredFeedback()).to.have.lengthOf(0);

    function getAndAssertFeedbackAction(): AnimateFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0]!.kind).to.be.equals('elementAnimateFeedback');
      return feedbacks[0] as AnimateFeedbackAction;
    }
  });
});
