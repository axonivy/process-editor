import { UnwrapSubOperation, WrapToSubOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { GModelElement } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { type QuickAction, type QuickActionProvider, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isSingleWrapable, isUnwrapable, isWrapable } from './model';

@injectable()
export class UnwrapQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return {
        icon: IvyIcons.Unwrap,
        title: t('quickAction.unwrap', { hotkey: 'U' }),
        location: 'Middle',
        sorting: 'B',
        action: UnwrapSubOperation.create({ elementId: element.id }),
        shortcut: 'KeyU'
      };
    }
    return undefined;
  }
}

@injectable()
export class WrapQuickActionProvider implements QuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isSingleWrapable(element)) {
      return this.quickAction([element.id]);
    }
    return undefined;
  }

  multiQuickAction(elements: GModelElement[]): QuickAction | undefined {
    const elementIds = elements.map(e => e.id);
    if (elementIds.length > 0 && !elements.find(element => !isWrapable(element))) {
      return this.quickAction(elementIds);
    }
    return undefined;
  }

  quickAction(elementIds: string[]): QuickAction {
    return {
      icon: IvyIcons.WrapToSubprocess,
      title: t('quickAction.wrap', { hotkey: 'W' }),
      location: 'Middle',
      sorting: 'B',
      action: WrapToSubOperation.create({ elementIds }),
      shortcut: 'KeyW'
    };
  }
}
