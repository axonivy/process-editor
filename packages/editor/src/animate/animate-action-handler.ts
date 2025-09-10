import { AnimateAction, MoveIntoViewportAction } from '@axonivy/process-editor-protocol';
import { Action, type IActionDispatcher, type IActionHandler, type IFeedbackActionDispatcher, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { AnimateFeedbackAction } from './animate-feedback-action';

@injectable()
export class AnimateActionHandler implements IActionHandler {
  private animateElementIDs: Set<string> = new Set();

  @inject(TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher!: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher!: IActionDispatcher;

  handle(action: Action) {
    if (AnimateAction.is(action)) {
      for (const id of action.elementIds) {
        this.animateElementIDs.add(id);
        const animateFeedback = AnimateFeedbackAction.create({ animatedIDs: [...this.animateElementIDs] });
        this.feedbackDispatcher.registerFeedback(this, [animateFeedback]);
        this.actionDispatcher.dispatch(MoveIntoViewportAction.create({ elementIds: [id] }));
        setTimeout(() => {
          this.animateElementIDs.delete(id);
          this.feedbackDispatcher.registerFeedback(this, [
            AnimateFeedbackAction.create({ animatedIDs: [...this.animateElementIDs], deAnimatedIDs: [id] })
          ]);
          if (this.animateElementIDs.size === 0) {
            this.feedbackDispatcher.deregisterFeedback(this, []);
          }
        }, 2000);
      }
    }
  }
}
