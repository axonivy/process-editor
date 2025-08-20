import { BasicPalette, PopoverArrow, PopoverContent, type PaletteConfig, type PaletteItemConfig } from '@axonivy/ui-components';
import { PaletteItem, type IActionDispatcher } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import { sortPaletteItems } from '../../../utils/menu-utils';
import { MenuIcons } from '../../menu/icons';
import { ShowToolBarMenuAction } from '../tool-bar-menu';

interface ToolBarPaletteItem extends PaletteItem {
  description?: string;
  children?: ToolBarPaletteItem[];
}

interface ToolBarPaletteMenuProps {
  paletteItems: ToolBarPaletteItem[];
  menuAction: ShowToolBarMenuAction;
  actionDispatcher: IActionDispatcher;
}

type ToolBarSections = PaletteConfig['sections'];

const paletteItemToConfig = (item: ToolBarPaletteItem, onSelected: (item: ToolBarPaletteItem) => void): PaletteItemConfig => ({
  name: item.label,
  description: item.description || item.label,
  icon: item.icon ? MenuIcons.get(item.icon) : undefined,
  onClick: async () => onSelected(item)
});

export const ToolBarPaletteMenu: React.FC<ToolBarPaletteMenuProps> = ({ paletteItems, menuAction, actionDispatcher }) => {
  const onItemSelected = React.useCallback(
    async (item: ToolBarPaletteItem) => {
      const actions = menuAction.actions(item);
      actionDispatcher.dispatchAll(actions);
    },
    [actionDispatcher, menuAction]
  );

  const sections = React.useMemo(() => {
    paletteItems.sort(sortPaletteItems);
    return paletteItems.reduce((sections: ToolBarSections, item: ToolBarPaletteItem) => {
      sections[item.label] ||= [];
      const items = item.children ?? [item];
      items.forEach(child => sections[item.label].push(paletteItemToConfig(child, onItemSelected)));
      return sections;
    }, {});
  }, [paletteItems, onItemSelected]);

  return (
    <PopoverContent className={'tool-bar-menu'}>
      <PopoverArrow />
      <BasicPalette sections={sections} options={{ searchPlaceholder: t('a11y.search.placeholder'), emptyMessage: t('label.empty') }} />
    </PopoverContent>
  );
};
