import { SetBreakpointAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isBreakable } from './model';

@injectable()
export class BreakpointQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isBreakable(element)) {
      return {
        icon: IvyIcons.Bug,
        title: t('quickAction.toggleBreakpoint', { hotkey: 'B' }),
        location: 'Left',
        sorting: 'C',
        action: SetBreakpointAction.create({ elementId: element.id }),
        letQuickActionsOpen: true,
        readonlySupport: true,
        shortcut: 'KeyB'
      };
    }
    return undefined;
  }
}
