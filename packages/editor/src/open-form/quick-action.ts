import { OpenFormEditorAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { hasGoToFormFeautre } from './model';

@injectable()
export class OpenFormQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (hasGoToFormFeautre(element)) {
      return {
        icon: IvyIcons.SubStart,
        title: t('quickAction.openForm', { hotkey: 'J' }),
        location: 'Middle',
        sorting: 'A',
        action: OpenFormEditorAction.create({ elementId: element.id }),
        readonlySupport: true,
        shortcut: 'KeyJ'
      };
    }
    return undefined;
  }
}
