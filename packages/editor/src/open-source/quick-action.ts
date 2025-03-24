import { GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { GoToSourceAction } from '@axonivy/process-editor-protocol';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { IvyIcons } from '@axonivy/ui-icons';
import { hasGoToSourceFeature } from './model';
import { t } from 'i18next';

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
