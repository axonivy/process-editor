import { Palette, PaletteSection, Spinner, type PaletteItemConfig } from '@axonivy/ui-components';
import { type IActionDispatcher, type PaletteItem } from '@eclipse-glsp/client';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import React from 'react';
import { genQueryKey } from '../../../utils/query-key';
import { MenuPaletteIcon } from '../../palette/MenuPaletteIcon';
import { MenuPaletteItem } from '../../palette/MenuPaletteItem';
import { paletteItemsToSections, type ExtendedPaletteItem } from '../../palette/palette-utils';
import { ShowToolBarMenuAction } from '../tool-bar-menu';

interface ToolBarPaletteMenuProps {
  onSelect: () => void;
  menuAction: ShowToolBarMenuAction;
  actionDispatcher: IActionDispatcher;
}

export type ToolPaletteItemConfig = PaletteItemConfig & {
  paletteIcon: React.ReactNode;
  info?: string;
};

export const ToolBarPaletteMenu = ({ onSelect, menuAction, actionDispatcher }: ToolBarPaletteMenuProps) => {
  const onItemSelected = React.useCallback(
    async (item: PaletteItem) => {
      const actions = menuAction.actions(item);
      actionDispatcher.dispatchAll(actions);
      onSelect();
    },
    [actionDispatcher, menuAction, onSelect]
  );

  const {
    data: sections,
    isPending,
    isError
  } = useQuery({
    queryKey: genQueryKey('palette-items', menuAction.id),
    queryFn: async () => await menuAction.paletteItems(),
    select: paletteItems =>
      paletteItemsToSections<ExtendedPaletteItem, ToolPaletteItemConfig>(paletteItems, item => ({
        name: item.label,
        description: item.description || item.label,
        paletteIcon: <MenuPaletteIcon item={item} />,
        info: item.info,
        onClick: async () => onItemSelected(item)
      }))
  });

  if (isPending) {
    return <Spinner size='small' />;
  }

  if (isError) {
    return t('label.empty');
  }

  return (
    <Palette sections={sections} options={{ searchPlaceholder: t('common.label.search'), emptyMessage: t('label.empty') }}>
      {(title, items) => (
        <PaletteSection key={title} title={title} items={items}>
          {item => <MenuPaletteItem key={item.name} {...item} horizontal={menuAction.id === 'extensions_menu'} />}
        </PaletteSection>
      )}
    </Palette>
  );
};
