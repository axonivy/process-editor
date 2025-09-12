import { IvyIcons } from '@axonivy/ui-icons';
import { Action, EnableDefaultToolsAction, EnableToolsAction, type IGridManager, MarqueeMouseTool, TYPES } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { currentTheme } from '../../theme/current-theme';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { CustomIconToggleActionHandler } from './options/action-handler';

export interface ToolBarButtonProvider {
  button(): ToolBarButton | undefined;
}

export enum ToolBarButtonLocation {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export interface ToolBarButton {
  icon: IvyIcons;
  title: string;
  sorting: string;
  action: () => Action;
  location: ToolBarButtonLocation;
  id: string;
  readonly?: boolean;
  switchFocus?: boolean;
  showTitle?: boolean;
  isNotMenu?: boolean;
}

export function compareButtons(a: ToolBarButton, b: ToolBarButton): number {
  const sortStringBased = a.sorting.localeCompare(b.sorting);
  if (sortStringBased !== 0) {
    return sortStringBased;
  }
  return a.title.localeCompare(b.title);
}

export const DefaultSelectButton = (): ToolBarButton => ({
  icon: IvyIcons.SelectionTool,
  title: t('toolbar.selection'),
  sorting: 'A',
  action: () => EnableDefaultToolsAction.create(),
  id: 'btn_default_tools',
  location: ToolBarButtonLocation.Left,
  readonly: true,
  switchFocus: true
});

export const MarqueeToolButton = (): ToolBarButton => ({
  icon: IvyIcons.MultiSelection,
  title: t('toolbar.marquee', { hotkey: 'Shift' }),
  sorting: 'B',
  action: () => EnableToolsAction.create([MarqueeMouseTool.ID]),
  id: 'btn_marquee_tools',
  location: ToolBarButtonLocation.Left,
  readonly: true,
  switchFocus: true
});

@injectable()
export class OptionsButtonProvider implements ToolBarButtonProvider {
  @inject(CustomIconToggleActionHandler) protected customIconHandler!: CustomIconToggleActionHandler;
  @inject(TYPES.IGridManager) protected gridManager!: IGridManager;

  button() {
    const customIconState = () => this.customIconHandler.isShowCustomIcons;
    const grid = () => this.gridManager.isGridVisible;
    const theme = () => currentTheme();
    return {
      icon: IvyIcons.Settings,
      title: t('common.label.settings'),
      sorting: 'Y',
      action: () => ShowToolBarOptionsMenuAction.create({ customIconState, grid, theme }),
      id: 'btn_options_menu',
      location: ToolBarButtonLocation.Right,
      readonly: true,
      switchFocus: true
    };
  }
}
