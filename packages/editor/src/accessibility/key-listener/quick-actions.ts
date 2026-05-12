import { Action, GModelElement, KeyListener, matchesKeystroke, SetUIExtensionVisibilityAction } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';

@injectable()
export class QuickActionKeyListener extends KeyListener {
  @inject(QuickActionUI) protected quickActionUi: QuickActionUI;

  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const quickActions = this.quickActionUi
      .getActiveQuickActions()
      .filter(quickAction => quickAction.shortcut && matchesKeystroke(event, quickAction.shortcut));
    if (quickActions.length === 1 && !quickActions[0].letQuickActionsOpen) {
      return [quickActions[0].action, SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false })];
    }
    return quickActions.map(quickAction => quickAction.action);
  }
}
