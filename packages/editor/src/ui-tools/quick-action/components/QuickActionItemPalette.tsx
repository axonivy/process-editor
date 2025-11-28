import { Palette, PaletteSection } from '@axonivy/ui-components';
import { PaletteItem, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MenuPaletteIcon } from '../../palette/MenuPaletteIcon';
import { MenuPaletteItem } from '../../palette/MenuPaletteItem';
import { paletteItemsToSections, type ExtendedPaletteItem } from '../../palette/palette-utils';
import type { ToolPaletteItemConfig } from '../../tool-bar/components/ToolBarPaletteMenu';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { newColorPaletteItem } from './ColorPaletteItem';

interface QuickActionItemPaletteProps {
  action: ShowQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  closeUi: () => void;
}

export const QuickActionItemPalette: React.FC<QuickActionItemPaletteProps> = ({ action, actionDispatcher, closeUi }) => {
  const { t } = useTranslation();
  const onItemSelected = React.useCallback(
    async (item: PaletteItem) => {
      const dispatcher = await actionDispatcher();
      const actions = action.actions(item, action.elementIds);
      await dispatcher.dispatchAll(actions);
      closeUi();
    },
    [closeUi, actionDispatcher, action]
  );

  const sections = React.useMemo(() => {
    const paletteItems = action.isEditable ? [...action.paletteItems(), newColorPaletteItem()] : action.paletteItems();
    return paletteItemsToSections<ExtendedPaletteItem, ToolPaletteItemConfig>(paletteItems, item => ({
      name: item.label,
      description: item.label,
      paletteIcon: <MenuPaletteIcon item={item} />,
      onClick: async () => onItemSelected(item)
    }));
  }, [action, onItemSelected]);

  return (
    <div className='bar-menu quick-action-bar-menu' ref={ref => ref?.querySelector('input')?.focus()}>
      <Palette options={{ searchPlaceholder: t('common.label.search'), emptyMessage: t('label.empty') }} sections={sections}>
        {(title, items) => (
          <PaletteSection key={title} title={title} items={items}>
            {item => <MenuPaletteItem key={item.name} {...item} />}
          </PaletteSection>
        )}
      </Palette>
    </div>
  );
};
