import { GoToSourceAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { hasGoToSourceFeature } from './model';

@injectable()
export class GoToSourceQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (hasGoToSourceFeature(element)) {
      return {
        icon: IvyIcons.GoToSource,
        title: t('quickAction.goToSource', { hotkey: 'S' }),
        location: 'Middle',
        sorting: 'B',
        action: GoToSourceAction.create(element.id),
        readonlySupport: true,
        shortcut: 'KeyS'
      };
    }
    return undefined;
  }
}
