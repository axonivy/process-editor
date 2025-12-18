import { GModelElement, GArgument } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { StartProcessAction, SearchProcessCallersAction } from '@axonivy/process-editor-protocol';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { StartEventNode } from '../diagram/model';
import { EventStartTypes } from '../diagram/view-types';
import { IvyIcons } from '@axonivy/ui-icons';

@injectable()
export class StarProcessQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && element.type === EventStartTypes.START) {
      const processStartUri = GArgument.getString(element, 'processStartUri');
      if (!processStartUri) {
        return undefined;
      }
      return {
        icon: IvyIcons.Play,
        title: 'Start Process (X)',
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
        title: 'Search callers of this process (O)',
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
