import { Palette, PaletteSection, type PaletteConfig } from '@axonivy/ui-components';
import { type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { sortPaletteItems } from '../../../utils/menu-utils';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import {
  colorItemToConfig,
  ColorPaletteItem,
  isNewColorPaletteItem,
  newColorPaletteItem,
  type ColorPaletteItemConfig
} from './ColorPaletteItem';
import { EditColorForm } from './EditColorForm';

interface QuickActionColorPaletteProps {
  action: ShowQuickActionMenuAction<ColorPaletteItem>;
  actionDispatcher: IActionDispatcherProvider;
  onClose: () => void;
}

type ColorPaletteSections = PaletteConfig<ColorPaletteItemConfig>['sections'];

export const QuickActionColorPalette: React.FC<QuickActionColorPaletteProps> = ({ action, actionDispatcher, onClose }) => {
  const [editingItem, setEditingItem] = React.useState<ColorPaletteItem | undefined>(undefined);

  const onItemSelected = React.useCallback(
    async (item: ColorPaletteItem) => {
      if (isNewColorPaletteItem(item)) {
        setEditingItem(item);
      } else {
        const dispatcher = await actionDispatcher();
        const actions = action.actions(item, action.elementIds);
        dispatcher.dispatchAll(actions);
        onClose?.();
      }
    },
    [setEditingItem, onClose, actionDispatcher, action]
  );

  const sections = React.useMemo(() => {
    const paletteItems = action.isEditable ? [...action.paletteItems(), newColorPaletteItem()] : action.paletteItems();
    paletteItems.sort(sortPaletteItems);
    return paletteItems.reduce((sections: ColorPaletteSections, item: ColorPaletteItem) => {
      sections[item.label] ||= [];
      const items = item.children ?? [item];
      items.forEach(child => sections[item.label].push(colorItemToConfig(child, action, onItemSelected, setEditingItem)));
      return sections;
    }, {});
  }, [action, onItemSelected, setEditingItem]);

  const hideForm = React.useCallback(() => setEditingItem(undefined), [setEditingItem]);

  return (
    <div className='bar-menu quick-action-bar-menu'>
      <Palette options={{ searchPlaceholder: 'Search colors...', emptyMessage: 'No colors available' }} sections={sections}>
        {(title, items) => (
          <PaletteSection key={title} title={title} items={items}>
            {item => <ColorPaletteItem key={item.source.id} {...item} />}
          </PaletteSection>
        )}
      </Palette>
      {!!editingItem && (
        <EditColorForm
          actionDispatcher={actionDispatcher}
          elementIds={action.elementIds}
          item={editingItem}
          onSave={hideForm}
          onDelete={hideForm}
        />
      )}
    </div>
  );
};
