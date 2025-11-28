import { Palette, PaletteSection } from '@axonivy/ui-components';
import { type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { paletteItemsToSections } from '../../palette/palette-utils';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { colorItemToConfig, ColorPaletteItem, isNewColorPaletteItem, newColorPaletteItem } from './ColorPaletteItem';
import { EditColorForm } from './EditColorForm';

interface QuickActionColorPaletteProps {
  action: ShowQuickActionMenuAction<ColorPaletteItem>;
  actionDispatcher: IActionDispatcherProvider;
  closeUi: () => void;
}

export const QuickActionColorPalette: React.FC<QuickActionColorPaletteProps> = ({ action, actionDispatcher, closeUi }) => {
  const { t } = useTranslation();
  const [editingItem, setEditingItem] = React.useState<ColorPaletteItem | undefined>(undefined);

  const onItemSelected = React.useCallback(
    async (item: ColorPaletteItem) => {
      if (isNewColorPaletteItem(item)) {
        setEditingItem(item);
      } else {
        const dispatcher = await actionDispatcher();
        const actions = action.actions(item, action.elementIds);
        dispatcher.dispatchAll(actions);
        closeUi();
      }
    },
    [setEditingItem, closeUi, actionDispatcher, action]
  );

  const sections = React.useMemo(() => {
    const paletteItems = action.isEditable ? [...action.paletteItems(), newColorPaletteItem()] : action.paletteItems();
    return paletteItemsToSections(paletteItems, item => colorItemToConfig(item, action, onItemSelected, setEditingItem));
  }, [action, onItemSelected, setEditingItem]);

  const hideForm = React.useCallback(() => setEditingItem(undefined), [setEditingItem]);

  return (
    <div className='bar-menu quick-action-bar-menu' ref={ref => ref?.querySelector('input')?.focus()}>
      <Palette options={{ searchPlaceholder: t('common.label.search'), emptyMessage: t('label.empty') }} sections={sections}>
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
