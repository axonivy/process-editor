import { SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { Action, SetUIExtensionVisibilityAction, TYPES, type IActionDispatcher, type IActionHandler } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { NotificationToasterId } from '../ui-tools/notification/di.config';

@injectable()
export class SwitchThemeActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  handle(action: Action) {
    if (SwitchThemeAction.is(action)) {
      const root = document.documentElement;
      root.dataset.theme = action.theme;
      root.classList.remove('light', 'dark');
      root.classList.add(action.theme);
      this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: NotificationToasterId, visible: true }));
    }
  }
}
