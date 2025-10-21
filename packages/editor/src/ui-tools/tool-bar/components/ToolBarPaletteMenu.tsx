import { cn, Flex, IvyIcon, Palette, PaletteSection, type PaletteItemConfig, type PaletteItemProps } from '@axonivy/ui-components';
import { type IActionDispatcher } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import { ActivityTypes, EventIntermediateTypes, EventStartTypes } from '../../../diagram/view-types';
import { paletteItemsToSections, type MenuPaletteItem } from '../../../utils/menu-utils';
import { MenuIcons } from '../../menu/icons';
import { ShowToolBarMenuAction } from '../tool-bar-menu';

interface ToolBarPaletteMenuProps {
  paletteItems: MenuPaletteItem[];
  menuAction: ShowToolBarMenuAction;
  actionDispatcher: IActionDispatcher;
}

export type ToolPaletteItemConfig = PaletteItemConfig & {
  paletteIcon: React.ReactNode;
  info?: string;
};

export const ToolBarPaletteMenu: React.FC<ToolBarPaletteMenuProps> = ({ paletteItems, menuAction, actionDispatcher }) => {
  const onItemSelected = React.useCallback(
    async (item: MenuPaletteItem) => {
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
      paletteItemsToSections<MenuPaletteItem, ToolPaletteItemConfig>(paletteItems, item => ({
        name: item.label,
        description: item.description || item.label,
        paletteIcon: <PaletteIcon item={item} />,
        info: item.info,
        onClick: async () => onItemSelected(item)
      })),
    [paletteItems, onItemSelected]
  );

  return (
    <Palette sections={sections} options={{ searchPlaceholder: t('a11y.search.placeholder'), emptyMessage: t('label.empty') }}>
      {(title, items) => (
        <PaletteSection key={title} title={title} items={items}>
          {item => <ToolPaletteItem key={item.name} {...item} horizontal={horizontal} />}
        </PaletteSection>
      )}
    </Palette>
  );
};

const PaletteIcon = ({ item }: { item: MenuPaletteItem }) => {
  if (!item.icon) {
    return <i />;
  }
  const ivyIcon = createPaletteIcon(item.icon);
  if (ivyIcon) {
    return <IvyIcon icon={ivyIcon} style={{ textAlign: 'center', fontSize: 24 }} />;
  }
  return (
    <span className='sprotty-icon'>
      <img src={item.icon} alt={item.label} />
    </span>
  );
};

function createPaletteIcon(icon: string) {
  if (icon.startsWith(ActivityTypes.THIRD_PARTY)) {
    return MenuIcons.get(ActivityTypes.THIRD_PARTY);
  }
  if (icon.startsWith(EventStartTypes.START_THIRD_PARTY)) {
    return MenuIcons.get(EventStartTypes.START_THIRD_PARTY);
  }
  if (icon.startsWith(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY)) {
    return MenuIcons.get(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY);
  }
  return MenuIcons.get(icon);
}

type ToolPaletteItemProps = PaletteItemProps<ToolPaletteItemConfig> & {
  horizontal?: boolean;
};

const ToolPaletteItem = ({ name, description, paletteIcon, info, onClick, classNames, horizontal }: ToolPaletteItemProps) => (
  <button
    className={cn(classNames.paletteItem, 'ui-palette-item')}
    onClick={onClick}
    title={description}
    data-style={horizontal ? 'horizontal' : 'vertical'}
  >
    <Flex gap={1} alignItems='center' className='ui-palette-item-content'>
      <Flex className={cn(classNames.paletteItemIcon, 'ui-palette-item-icon')} justifyContent='center' alignItems='center'>
        {paletteIcon}
      </Flex>
      <Flex justifyContent='center' gap={1} className='ui-palette-item-text'>
        <span className='ui-palette-item-label'>{name}</span>
        {info && <span className='ui-palette-item-label ui-palette-item-info'>{info}</span>}
      </Flex>
    </Flex>
  </button>
);
