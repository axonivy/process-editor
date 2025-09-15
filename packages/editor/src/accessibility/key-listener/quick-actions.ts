import { Action, GModelElement, KeyListener } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';

@injectable()
export class QuickActionKeyListener extends KeyListener {
  @inject(QuickActionUI) protected quickActionUi!: QuickActionUI;

  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const quickActions = this.quickActionUi
      .getActiveQuickActions()
      .filter(quickAction => quickAction.shortcut && matchesKeystroke(event, quickAction.shortcut));
    const firstQuickAction = quickActions[0];
    if (firstQuickAction && !firstQuickAction.letQuickActionsOpen) {
      return [firstQuickAction.action, QuickActionUI.hide()];
    }
    return quickActions.map(quickAction => quickAction.action);
  }
}
