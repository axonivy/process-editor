import { BasicPalette, type PaletteConfig, type PaletteItemConfig } from '@axonivy/ui-components';
import { PaletteItem, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { MenuIcons } from '../../menu/icons';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { newColorPaletteItem } from './ColorPaletteItem';

interface QuickActionItemPaletteProps {
  action: ShowQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  onClose: () => void;
}

const paletteItemToConfig = (item: PaletteItem, onSelected: (item: PaletteItem) => void): PaletteItemConfig => ({
  name: item.label,
  description: item.label,
  icon: item.icon ? MenuIcons.get(item.icon) : undefined,
  onClick: async () => onSelected(item)
});

type PaletteSections = PaletteConfig['sections'];

export const QuickActionItemPalette: React.FC<QuickActionItemPaletteProps> = ({ action, actionDispatcher, onClose }) => {
  const onItemSelected = React.useCallback(
    async (item: PaletteItem) => {
      const dispatcher = await actionDispatcher();
      const actions = action.actions(item, action.elementIds);
      dispatcher.dispatchAll(actions);
      onClose?.();
    },
    [onClose, actionDispatcher, action]
  );

  const sections = React.useMemo(() => {
    const paletteItems = action.isEditable ? [...action.paletteItems(), newColorPaletteItem()] : action.paletteItems();
    return paletteItems.reduce((sections: PaletteSections, item: PaletteItem) => {
      sections[item.label] ||= [];
      const items = item.children ?? [item];
      items.forEach(child => sections[item.label].push(paletteItemToConfig(child, onItemSelected)));
      return sections;
    }, {});
  }, [action, onItemSelected]);

  return (
    <div className='bar-menu quick-action-bar-menu'>
      <BasicPalette
        options={{
          searchPlaceholder: 'Search actions...',
          emptyMessage: 'No actions available',
          searchFilter: (item, term) => item.description.toLocaleLowerCase().includes(term.toLocaleLowerCase())
        }}
        sections={sections}
      />
    </div>
  );
};
