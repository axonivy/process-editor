import {
  ChangeBoundsManager,
  FeedbackEmitter,
  GModelElement,
  SelectionService,
  TrackedMove,
  type TrackedResize
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';

@injectable()
export class IvyChangeBoundsManager extends ChangeBoundsManager {
  @inject(SelectionService) protected selectionService: SelectionService;

  addMoveFeedback(feedback: FeedbackEmitter, trackedMove: TrackedMove, ctx?: GModelElement, event?: MouseEvent): FeedbackEmitter {
    super.addMoveFeedback(feedback, trackedMove, ctx, event);
    this.hideQuickUIFeedback(feedback);
    return feedback;
  }

  addResizeFeedback(feedback: FeedbackEmitter, resize: TrackedResize, ctx?: GModelElement, event?: MouseEvent): FeedbackEmitter {
    super.addResizeFeedback(feedback, resize, ctx, event);
    this.hideQuickUIFeedback(feedback);
    return feedback;
  }

  protected hideQuickUIFeedback(feedback: FeedbackEmitter): void {
    feedback.add(QuickActionUI.hide(), QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]));
  }
}
