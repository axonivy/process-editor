import { Action, GModelElement, KeyListener } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';

@injectable()
export class QuickActionKeyListener extends KeyListener {
  @inject(QuickActionUI) protected quickActionUi: QuickActionUI;

  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const quickActions = this.quickActionUi
      .getActiveQuickActions()
      .filter(quickAction => quickAction.shortcut && matchesKeystroke(event, quickAction.shortcut));
    if (quickActions.length === 1 && !quickActions[0].letQuickActionsOpen) {
      return [quickActions[0].action, QuickActionUI.hide()];
    }
    return quickActions.map(quickAction => quickAction.action);
  }
}
