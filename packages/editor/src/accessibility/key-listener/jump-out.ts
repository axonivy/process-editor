import { JumpAction } from '@axonivy/process-editor-protocol';
import { Action, GModelElement, KeyListener, SelectionService } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';

@injectable()
export class JumpOutKeyListener extends KeyListener {
  @inject(SelectionService) protected selectionService!: SelectionService;
  @inject(QuickActionUI) protected quickActionUi!: QuickActionUI;

  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyJ') && this.isJumpOutActive()) {
      return [JumpAction.create({ elementId: '' })];
    } else {
      return [];
    }
  }

  private isJumpOutActive(): boolean {
    return this.selectionService.getModelRoot().id.includes('-') && !this.isJumpIntoActive();
  }

  private isJumpIntoActive(): boolean {
    return this.quickActionUi
      .getActiveQuickActions()
      .map(quickAction => quickAction.action)
      .map(action => action.kind)
      .some(kind => kind === 'jumpInto');
  }
}
