import { CreateNodeOperation, GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { IvyIcons } from '@axonivy/ui-icons';

import { LaneNode } from '../diagram/model';
import { LaneTypes } from '../diagram/view-types';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { t } from 'i18next';

@injectable()
export class CreateLaneQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof LaneNode && element.type === LaneTypes.POOL) {
      return {
        icon: IvyIcons.LaneSwimlanes,
        title: t('quickAction.createLane'),
        location: 'Right',
        sorting: 'A',
        letQuickActionsOpen: true,
        action: CreateNodeOperation.create(LaneTypes.LANE, { containerId: element.id })
      };
    }
    return undefined;
  }
}
