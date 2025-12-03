import { ChangeIconOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { Action, GModelElement, PaletteItem, TYPES, type IActionDispatcher, type MaybePromise } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { isWithCustomIcon } from '../../../diagram/icon/model';
import { ActivityTypes } from '../../../diagram/view-types';
import { IVY_TYPES } from '../../../types';
import { SingleQuickActionProvider, type QuickAction } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import type { IconPaletteHandler } from './action-handler';

@injectable()
export class SelectIconQuickActionProvider extends SingleQuickActionProvider {
  @inject(IVY_TYPES.IconPalette) protected readonly icons!: IconPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (!isWithCustomIcon(element) || element.type === ActivityTypes.COMMENT) {
      return;
    }
    return this.quickAction(element.id, this.icons.getPaletteItems(element));
  }

  quickAction(elementId: string, paletteItems: () => MaybePromise<PaletteItem[]>): QuickAction {
    return {
      icon: IvyIcons.CustomImage,
      title: t('quickAction.customIcon'),
      location: 'Middle',
      sorting: 'C',
      action: ShowQuickActionMenuAction.create({
        elementIds: [elementId],
        paletteItems,
        actions: this.actions,
        customCssClass: 'icons-menu'
      }),
      letQuickActionsOpen: true,
      readonlySupport: false
    };
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeIconOperation.changeIcon({
      elementId: elementIds[0] ?? '',
      icon: item.icon ?? ''
    })
  ];
}
