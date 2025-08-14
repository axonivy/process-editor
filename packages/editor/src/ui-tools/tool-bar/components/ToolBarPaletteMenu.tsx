import { BasicPalette, PopoverArrow, PopoverContent } from '@axonivy/ui-components';
import { type IActionDispatcher, type PaletteItem } from '@eclipse-glsp/client';
import React from 'react';
import { MenuIcons } from '../../menu/icons';
import { ShowToolBarMenuAction } from '../tool-bar-menu';

interface ToolBarPaletteMenuProps {
  paletteItems: PaletteItem[];
  menuAction: ShowToolBarMenuAction;
  actionDispatcher: IActionDispatcher;
}

export const ToolBarPaletteMenu: React.FC<ToolBarPaletteMenuProps> = ({ paletteItems, menuAction, actionDispatcher }) => {
  const transformPaletteItemsToSections = (items: PaletteItem[]): Record<string, any[]> => {
    const sections: Record<string, any[]> = {};

    items.forEach(item => {
      if (item.children) {
        sections[item.label] = item.children.map(child => ({
          name: child.label,
          description: (child as any).description || child.label,
          icon: child.icon ? MenuIcons.get(child.icon) : undefined,
          onClick: () => {
            const actions = menuAction.actions(child);
            actionDispatcher.dispatchAll(actions);
          }
        }));
      }
    });

    return sections;
  };

  const sections = transformPaletteItemsToSections(paletteItems);

  return (
    <PopoverContent className={'tool-bar-menu-content'}>
      <PopoverArrow />
      <BasicPalette sections={sections} options={{ searchPlaceholder: 'Search...', emptyMessage: 'No items found' }} />
    </PopoverContent>
  );
};
