import { AutoBendEdgeOperation, StraightenEdgeOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GEdge, GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { QuickActionTriggerEdgeCreationAction } from '../ui-tools/quick-action/edge/edge-creation-tool';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

@injectable()
export class StraightenEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof GEdge) {
      return {
        icon: IvyIcons.Straighten,
        title: t('quickAction.straighten', { hotkey: 'S' }),
        location: 'Middle',
        sorting: 'A',
        action: StraightenEdgeOperation.create({ elementId: element.id }),
        letQuickActionsOpen: true,
        shortcut: 'KeyS'
      };
    }
    return undefined;
  }
}

@injectable()
export class AutoBendEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof GEdge) {
      return {
        icon: IvyIcons.Bend,
        title: t('quickAction.bend', { hotkey: 'B' }),
        location: 'Middle',
        sorting: 'B',
        action: AutoBendEdgeOperation.create({ elementId: element.id }),
        letQuickActionsOpen: true,
        shortcut: 'KeyB'
      };
    }
    return undefined;
  }
}

@injectable()
export class ReconnectEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof GEdge) {
      return {
        icon: IvyIcons.Reconnect,
        title: t('quickAction.reconnect', { hotkey: 'R' }),
        location: 'Right',
        sorting: 'A',
        action: QuickActionTriggerEdgeCreationAction.create(element.type, element.sourceId, { edgeId: element.id, reconnect: true }),
        letQuickActionsOpen: true,
        shortcut: 'KeyR'
      };
    }
    return undefined;
  }
}
