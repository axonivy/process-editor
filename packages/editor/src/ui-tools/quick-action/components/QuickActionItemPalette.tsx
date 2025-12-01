import { Palette, PaletteSection, Spinner } from '@axonivy/ui-components';
import { PaletteItem, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { genQueryKey } from '../../../utils/query-key';
import { MenuPaletteIcon } from '../../palette/MenuPaletteIcon';
import { MenuPaletteItem } from '../../palette/MenuPaletteItem';
import { paletteItemsToSections, type ExtendedPaletteItem } from '../../palette/palette-utils';
import type { ToolPaletteItemConfig } from '../../tool-bar/components/ToolBarPaletteMenu';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { QuickActionPaletteWrapper } from './QuickActionPaletteWrapper';

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

  const {
    data: sections,
    isPending,
    isError
  } = useQuery({
    queryKey: genQueryKey('quick-action-palette-items', action.customCssClass, action.elementIds),
    queryFn: async () => await action.paletteItems(),
    select: paletteItems =>
      paletteItemsToSections<ExtendedPaletteItem, ToolPaletteItemConfig>(paletteItems, item => ({
        name: item.label,
        description: item.label,
        paletteIcon: <MenuPaletteIcon item={item} />,
        onClick: async () => onItemSelected(item)
      }))
  });

  if (isPending) {
    return (
      <QuickActionPaletteWrapper>
        <Spinner size='small' />
      </QuickActionPaletteWrapper>
    );
  }

  if (isError) {
    return <QuickActionPaletteWrapper>{t('label.empty')}</QuickActionPaletteWrapper>;
  }

  return (
    <QuickActionPaletteWrapper ref={ref => ref?.querySelector('input')?.focus()}>
      <Palette options={{ searchPlaceholder: t('common.label.search'), emptyMessage: t('label.empty') }} sections={sections}>
        {(title, items) => (
          <PaletteSection key={title} title={title} items={items}>
            {item => <MenuPaletteItem key={item.name} {...item} />}
          </PaletteSection>
        )}
      </Palette>
    </QuickActionPaletteWrapper>
  );
};
