import { Palette, PaletteSection, Spinner } from '@axonivy/ui-components';
import { type IActionDispatcherProvider } from '@eclipse-glsp/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { genQueryKey } from '../../../utils/query-key';
import { paletteItemsToSections } from '../../palette/palette-utils';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { colorItemToConfig, ColorPaletteItem, isNewColorPaletteItem, newColorPaletteItem } from './ColorPaletteItem';
import { EditColorForm } from './EditColorForm';
import { QuickActionPaletteWrapper } from './QuickActionPaletteWrapper';

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

  const {
    data: sections,
    isPending,
    isError
  } = useQuery({
    queryKey: genQueryKey('quick-action-color-palette-items', action.customCssClass, action.elementIds),
    queryFn: async () => await action.paletteItems(),
    select: paletteItems => {
      const items = [...paletteItems, newColorPaletteItem()];
      return paletteItemsToSections(items, item => colorItemToConfig(item, action, onItemSelected, setEditingItem));
    }
  });

  const queryClient = useQueryClient();

  const hideForm = React.useCallback(() => {
    setEditingItem(undefined);
    queryClient.invalidateQueries({ queryKey: genQueryKey('quick-action-color-palette-items') });
  }, [queryClient]);

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
    </QuickActionPaletteWrapper>
  );
};
