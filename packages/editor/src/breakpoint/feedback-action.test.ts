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
import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from './feedback-action';
import { SBreakpointHandle, breakpointFeature } from './model';

let root: GModelRoot;

@injectable()
class BreakpointFeedbackCommandMock extends BreakpointFeedbackCommand {
  override execute(context: CommandExecutionContext): GModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

function createContainer(): Container {
  const container = createTestContainer();
  configureCommand(container, BreakpointFeedbackCommandMock);
  return container;
}

describe('BreakpointFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    root = new GModelRoot();
  });

  test('SBreakpointHandle will not be added to a unbreakable element', async () => {
    const node = new GChildElement();
    node.id = 'notbreakable';
    root.add(node);

    const invalidBreakpoint = { elementId: 'notbreakable', condition: '', disabled: false };
    await actionDispatcher.dispatch(BreakpointFeedbackAction.create({ breakpoints: [invalidBreakpoint] }));
    expect(node.children).toHaveLength(0);
  });

  test('SBreakpointHandle will be added/removed to/from a breakable element', async () => {
    const node = new GChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    const elementBreakpoint = { elementId: 'foo', condition: '', disabled: false };
    await actionDispatcher.dispatch(BreakpointFeedbackAction.create({ breakpoints: [elementBreakpoint] }));
    expect(node.children).to.have.lengthOf(1);
    assertBreakpoint(node.children[0]!, '', false, false);
    expect(node.children[0]).to.be.an.instanceOf(SBreakpointHandle);

    await actionDispatcher.dispatch(BreakpointFeedbackAction.create({ breakpoints: [], oldBreakpoints: [elementBreakpoint] }));
    expect(node.children).toHaveLength(0);
  });

  test('SBreakpointHandle will get correct infos', async () => {
    const node = new GChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    const elementBreakpoint = { elementId: 'foo', condition: 'test condition', disabled: true };
    await actionDispatcher.dispatch(
      BreakpointFeedbackAction.create({ breakpoints: [elementBreakpoint], oldBreakpoints: [], globalDisabled: true })
    );
    expect(node.children).to.have.lengthOf(1);
    assertBreakpoint(node.children[0]!, 'test condition', true, true);
    expect(node.children[0]).to.be.an.instanceOf(SBreakpointHandle);
  });

  function assertBreakpoint(element: GChildElement, expectedCondition: string, isDisabled: boolean, isGlobalDisabled: boolean): void {
    expect(element).to.be.an.instanceOf(SBreakpointHandle);
    const breakpoint = element as SBreakpointHandle;
    expect(breakpoint.condition).to.be.equals(expectedCondition);
    expect(breakpoint.disabled).to.be.equals(isDisabled);
    expect(breakpoint.globalDisabled).to.be.equals(isGlobalDisabled);
  }
});
