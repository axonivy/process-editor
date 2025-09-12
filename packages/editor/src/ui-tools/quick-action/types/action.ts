import { ChangeActivityTypeOperation } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { Action, GModelElement, PaletteItem, TYPES, type IActionDispatcher } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { isUnwrapable } from '../../../wrap/model';
import { SingleQuickActionProvider, type QuickAction } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { TypesPaletteHandler } from './action-handler';

@injectable()
export class SelectActivityTypeQuickActionProvider extends SingleQuickActionProvider {
  @inject(IVY_TYPES.ActivityTypesPalette) protected readonly types!: TypesPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return {
        icon: IvyIcons.ChangeType,
        title: t('quickAction.selectType'),
        location: 'Middle',
        sorting: 'Y',
        action: ShowQuickActionMenuAction.create({
          elementIds: [element.id],
          paletteItems: () => this.types.getPaletteItems(),
          actions: this.actions,
          customCssClass: 'activity-type-menu'
        }),
        letQuickActionsOpen: true,
        readonlySupport: false
      };
    }
    return;
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeActivityTypeOperation.create({ elementId: elementIds[0] ?? '', typeId: item.id }),
    ShowQuickActionMenuAction.empty()
  ];
}
