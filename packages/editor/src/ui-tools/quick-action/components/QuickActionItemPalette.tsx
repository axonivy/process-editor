import { BasicPalette } from '@axonivy/ui-components';
import { PaletteItem, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { paletteItemsToSections } from '../../../utils/menu-utils';
import { MenuIcons } from '../../menu/icons';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { newColorPaletteItem } from './ColorPaletteItem';

interface QuickActionItemPaletteProps {
  action: ShowQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  onClose: () => void;
}

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
    return paletteItemsToSections(paletteItems, item => ({
      name: item.label,
      description: item.label,
      icon: item.icon ? MenuIcons.get(item.icon) : undefined,
      onClick: async () => onItemSelected(item)
    }));
  }, [action, onItemSelected]);

  return (
    <div className='bar-menu quick-action-bar-menu' ref={ref => ref?.querySelector('input')?.focus()}>
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
