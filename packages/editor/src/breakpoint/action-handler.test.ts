import type { ActionDispatcher, FeedbackActionDispatcher } from '@eclipse-glsp/client';
import { Bounds, configureActionHandler, configureCommand, InitializeCanvasBoundsAction, TYPES } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import { beforeEach, describe, expect, test } from 'vitest';

import { ShowBreakpointAction } from '@axonivy/process-editor-protocol';
import { createTestContainer } from '../utils/test-utils';
import { ShowBreakpointActionHandler } from './action-handler';
import type { BreakpointFeedbackAction } from './feedback-action';
import { BreakpointFeedbackCommand } from './feedback-action';

function createContainer(): Container {
  const container = createTestContainer();
  container.bind(ShowBreakpointActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, ShowBreakpointAction.KIND, ShowBreakpointActionHandler);
  configureCommand(container, BreakpointFeedbackCommand);
  return container;
}

describe('ShowBreakpointActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  test('creates BreakpointFeedbackAction', async () => {
    const elementBreakpoint = { elementId: 'foo', condition: '', disabled: false };
    await actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: [elementBreakpoint], globalDisabled: false }));
    let action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.include(elementBreakpoint);
    expect(action.globalDisabled).toBeFalsy();

    await actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: [elementBreakpoint], globalDisabled: true }));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.include(elementBreakpoint);
    expect(action.globalDisabled).toBeTruthy();

    await actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: [], globalDisabled: false }));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).toHaveLength(0);
    expect(action.globalDisabled).toBeFalsy();

    function getAndAssertBreakpointFeedbackAction(): BreakpointFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0]!.kind).to.be.equals('elementBreakpointFeedback');
      return feedbacks[0] as BreakpointFeedbackAction;
    }
  });
});
