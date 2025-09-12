import {
  ActionDispatcher,
  Bounds,
  type CommandExecutionContext,
  GChildElement,
  GModelRoot,
  InitializeCanvasBoundsAction,
  TYPES,
  configureCommand,
  createFeatureSet
} from '@eclipse-glsp/client';
import { Container, injectable } from 'inversify';
import { beforeEach, describe, expect, test } from 'vitest';

import { createTestContainer } from '../utils/test-utils';
import { AnimateFeedbackAction, AnimateFeedbackCommand } from './animate-feedback-action';
import { animateFeature } from './model';

let root: GModelRoot;

@injectable()
class AnimateFeedbackCommandMock extends AnimateFeedbackCommand {
  override execute(context: CommandExecutionContext): GModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

class AnimationNode extends GChildElement {
  override features = createFeatureSet([animateFeature]);
}

function createContainer(): Container {
  const container = createTestContainer();
  configureCommand(container, AnimateFeedbackCommandMock);
  return container;
}

describe('AnimateFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    root = new GModelRoot();
  });

  test('Animate css class is set on element', async () => {
    const node = new AnimationNode();
    node.id = 'foo';
    root.add(node);

    await actionDispatcher.dispatch(AnimateFeedbackAction.create({ animatedIDs: ['foo'] }));
    expect(node.cssClasses).to.include('animate');

    await actionDispatcher.dispatch(AnimateFeedbackAction.create({ animatedIDs: [], deAnimatedIDs: ['foo'] }));
    expect(node.cssClasses).to.not.include('animate');
  });
});
