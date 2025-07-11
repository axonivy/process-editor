import { OpenDecoratorBrowserAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { isWithCustomIcon } from '../diagram/icon/model';
import { ActivityTypes } from '../diagram/view-types';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

@injectable()
export class CustomIconQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isWithCustomIcon(element) && element.type !== ActivityTypes.COMMENT) {
      return {
        icon: IvyIcons.CustomImage,
        title: t('quickAction.customIcon'),
        location: 'Middle',
        sorting: 'C',
        action: OpenDecoratorBrowserAction.create(element.id),
        letQuickActionsOpen: true
      };
    }
    return undefined;
  }
}
