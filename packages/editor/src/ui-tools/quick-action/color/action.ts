import { ChangeColorOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { Action, GModelElement, PaletteItem, TYPES, type IActionDispatcher, type MaybePromise } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { LaneTypes } from '../../../diagram/view-types';
import { IVY_TYPES } from '../../../types';
import type { QuickAction, QuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { ColorPaletteHandler } from './action-handler';

@injectable()
export class SelectColorQuickActionProvider implements QuickActionProvider {
  @inject(IVY_TYPES.ColorPalette) protected readonly colors!: ColorPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element.type === LaneTypes.POOL) {
      return;
    }
    return this.quickAction([element.id], this.colors.getPaletteItems());
  }

  multiQuickAction(elements: GModelElement[]): QuickAction | undefined {
    return this.quickAction(
      elements.map(element => element.id),
      this.colors.getPaletteItems()
    );
  }

  quickAction(elementIds: string[], paletteItems: () => MaybePromise<PaletteItem[]>): QuickAction {
    return {
      icon: IvyIcons.ColorDrop,
      title: t('quickAction.color'),
      location: 'Middle',
      sorting: 'Z',
      action: ShowQuickActionMenuAction.create({
        elementIds,
        paletteItems,
        actions: this.actions,
        customCssClass: 'colors-menu',
        isEditable: true
      }),
      letQuickActionsOpen: true,
      readonlySupport: false
    };
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeColorOperation.changeColor({
      elementIds: elementIds,
      color: item.icon ?? '',
      colorName: item.label
    })
  ];
}
