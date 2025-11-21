import { Palette, PaletteSection, type PaletteItemConfig } from '@axonivy/ui-components';
import { type IActionDispatcher } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import { paletteItemsToSections, type ExtendedPaletteItem } from '../../menu/menu-utils';
import { MenuPaletteIcon } from '../../menu/MenuPaletteIcon';
import { MenuPaletteItem } from '../../menu/MenuPaletteItem';
import { ShowToolBarMenuAction } from '../tool-bar-menu';

interface ToolBarPaletteMenuProps {
  paletteItems: ExtendedPaletteItem[];
  menuAction: ShowToolBarMenuAction;
  actionDispatcher: IActionDispatcher;
}

export type ToolPaletteItemConfig = PaletteItemConfig & {
  paletteIcon: React.ReactNode;
  info?: string;
};

export const ToolBarPaletteMenu: React.FC<ToolBarPaletteMenuProps> = ({ paletteItems, menuAction, actionDispatcher }) => {
  const onItemSelected = React.useCallback(
    async (item: ExtendedPaletteItem) => {
      const actions = menuAction.actions(item);
      actionDispatcher.dispatchAll(actions);
    },
    [actionDispatcher, menuAction]
  );

  let horizontal = false;
  if (menuAction.id === 'extensions_menu') {
    horizontal = true;
  }

  const sections = React.useMemo(
    () =>
      paletteItemsToSections<ExtendedPaletteItem, ToolPaletteItemConfig>(paletteItems, item => ({
        name: item.label,
        description: item.description || item.label,
        paletteIcon: <MenuPaletteIcon item={item} />,
        info: item.info,
        onClick: async () => onItemSelected(item)
      })),
    [paletteItems, onItemSelected]
  );

  return (
    <Palette sections={sections} options={{ searchPlaceholder: t('common.label.search'), emptyMessage: t('label.empty') }}>
      {(title, items) => (
        <PaletteSection key={title} title={title} items={items}>
          {item => <MenuPaletteItem key={item.name} {...item} horizontal={horizontal} />}
        </PaletteSection>
      )}
    </Palette>
  );
};
