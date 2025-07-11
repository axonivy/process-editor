import { AutoAlignOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { Action, DeleteElementOperation, GModelElement, isDeletable } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import type { KeyCode } from 'sprotty/lib/utils/keyboard';

export type QuickActionLocation = 'Left' | 'Middle' | 'Right' | 'Hidden';

export interface QuickAction {
  icon: IvyIcons;
  title: string;
  location: QuickActionLocation;
  sorting: string;
  action: Action;
  letQuickActionsOpen?: boolean;
  readonlySupport?: boolean;
  shortcut?: KeyCode;
  removeSelection?: boolean;
}

export interface QuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined;
  multiQuickAction(elements: GModelElement[]): QuickAction | undefined;
}

@injectable()
export abstract class SingleQuickActionProvider implements QuickActionProvider {
  abstract singleQuickAction(element: GModelElement): QuickAction | undefined;
  multiQuickAction() {
    return undefined;
  }
}

@injectable()
export abstract class MultipleQuickActionProvider implements QuickActionProvider {
  abstract multiQuickAction(elements: GModelElement[]): QuickAction | undefined;
  singleQuickAction() {
    return undefined;
  }
}

@injectable()
export class DeleteQuickActionProvider implements QuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isDeletable(element)) {
      return this.quickAction([element.id]);
    }
    return undefined;
  }

  multiQuickAction(elements: GModelElement[]): QuickAction | undefined {
    const elementIds = elements.filter(e => isDeletable(e)).map(e => e.id);
    if (elementIds.length > 0) {
      return this.quickAction(elementIds);
    }
    return undefined;
  }

  quickAction(elementIds: string[]): QuickAction {
    return {
      icon: IvyIcons.Trash,
      title: t('quickAction.delete'),
      location: 'Left',
      sorting: 'A',
      action: DeleteElementOperation.create(elementIds)
    };
  }
}

@injectable()
export class AutoAlignQuickActionProvider extends MultipleQuickActionProvider {
  multiQuickAction(elements: GModelElement[]): QuickAction | undefined {
    const elementIds = elements.map(e => e.id);
    if (elementIds.length > 0) {
      return {
        icon: IvyIcons.AutoAlign,
        title: t('quickAction.autoAlign', { hotkey: 'A' }),
        location: 'Middle',
        sorting: 'Y',
        action: AutoAlignOperation.create({ elementIds: elementIds }),
        shortcut: 'KeyA'
      };
    }
    return undefined;
  }
}
