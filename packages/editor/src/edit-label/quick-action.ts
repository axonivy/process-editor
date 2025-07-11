import { IvyIcons } from '@axonivy/ui-icons';
import { EditLabelAction, GModelElement, isWithEditableLabel } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

@injectable()
export class EditLabelActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isWithEditableLabel(element) && element.editableLabel) {
      return {
        icon: IvyIcons.Label,
        title: t('quickAction.editLabel', { hotkey: 'L' }),
        location: 'Middle',
        sorting: 'C',
        action: EditLabelAction.create(element.editableLabel.id),
        shortcut: 'KeyL',
        letQuickActionsOpen: true
      };
    }
    return undefined;
  }
}
