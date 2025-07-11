import { SearchProcessCallersAction, StartProcessAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GArgument, GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { StartEventNode } from '../diagram/model';
import { EventStartTypes } from '../diagram/view-types';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

@injectable()
export class StarProcessQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && element.type === EventStartTypes.START) {
      const processStartUri = GArgument.getString(element, 'processStartUri') ?? '';
      return {
        icon: IvyIcons.Play,
        title: t('quickAction.startProcess', { hotkey: 'X' }),
        location: 'Left',
        sorting: 'A',
        action: StartProcessAction.create(element.id, processStartUri),
        readonlySupport: true,
        shortcut: 'KeyX',
        removeSelection: true
      };
    }
    return undefined;
  }
}

@injectable()
export class SearchProcessCallersActionProvider extends SingleQuickActionProvider {
  private supportedEventTypes = [
    EventStartTypes.START,
    EventStartTypes.START_ERROR,
    EventStartTypes.START_SUB,
    EventStartTypes.START_HD,
    EventStartTypes.START_HD_METHOD
  ];
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && this.isSearchViewAvailable(element.type)) {
      return {
        icon: IvyIcons.Search,
        title: t('quickAction.searchCallers', { hotkey: 'O' }),
        location: 'Left',
        sorting: 'B',
        action: SearchProcessCallersAction.create(element.id),
        letQuickActionsOpen: true,
        readonlySupport: true,
        shortcut: 'KeyO'
      };
    }
    return undefined;
  }

  private isSearchViewAvailable(type: string): boolean {
    return this.supportedEventTypes.includes(type);
  }
}
