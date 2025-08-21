import { cn, Flex, IvyIcon, Palette, PaletteSection, type PaletteItemConfig, type PaletteItemProps } from '@axonivy/ui-components';
import type { IvyIcons } from '@axonivy/ui-icons';
import { type IActionDispatcher } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import { ActivityTypes, EventIntermediateTypes, EventStartTypes } from '../../../diagram/view-types';
import { paletteItemsToSections, type MenuPaletteItem } from '../../../utils/menu-utils';
import { createIcon } from '../../../utils/ui-utils';
import { MenuIcons } from '../../menu/icons';
import { ShowToolBarMenuAction } from '../tool-bar-menu';

interface ToolBarPaletteMenuProps {
  paletteItems: MenuPaletteItem[];
  menuAction: ShowToolBarMenuAction;
  actionDispatcher: IActionDispatcher;
}

export type ToolPaletteItemConfig = PaletteItemConfig & {
  icon: string | React.ReactNode /* items may specify image path so we need to translate into img */;
};

export const ToolBarPaletteMenu: React.FC<ToolBarPaletteMenuProps> = ({ paletteItems, menuAction, actionDispatcher }) => {
  const onItemSelected = React.useCallback(
    async (item: MenuPaletteItem) => {
      const actions = menuAction.actions(item);
      actionDispatcher.dispatchAll(actions);
    },
    [actionDispatcher, menuAction]
  );

  const sections = React.useMemo(() => {
    return paletteItemsToSections(
      paletteItems,
      item =>
        ({
          name: item.label + (item.info || ''),
          description: item.description || item.label,
          icon: createPaletteIcon(item),
          onClick: async () => onItemSelected(item)
        }) as ToolPaletteItemConfig
    );
  }, [paletteItems, onItemSelected]);

  return (
    <Palette sections={sections} options={{ searchPlaceholder: t('a11y.search.placeholder'), emptyMessage: t('label.empty') }}>
      {(title, items) => (
        <PaletteSection key={title} title={title} items={items}>
          {item => <ToolPaletteItem key={item.name} {...item} />}
        </PaletteSection>
      )}
    </Palette>
  );
};

function createPaletteIcon(item: MenuPaletteItem): IvyIcons | React.ReactNode | HTMLElement {
  if (!item.icon) {
    return createIcon();
  }
  if (item.icon.startsWith(ActivityTypes.THIRD_PARTY)) {
    return MenuIcons.get(ActivityTypes.THIRD_PARTY);
  }
  if (item.icon.startsWith(EventStartTypes.START_THIRD_PARTY)) {
    return MenuIcons.get(EventStartTypes.START_THIRD_PARTY);
  }
  if (item.icon.startsWith(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY)) {
    return MenuIcons.get(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY);
  }
  const knownIcon = MenuIcons.get(item.icon);
  if (knownIcon) {
    return knownIcon;
  }
  return (
    <span className='sprotty-icon'>
      <img src={item.icon} alt={item.label} />
    </span>
  );
}

// Extended PaletteItem so that we can render images as icons

const ToolPaletteItem = ({ name, description, icon, onClick, classNames }: PaletteItemProps<ToolPaletteItemConfig>) => (
  <button className={cn(classNames.paletteItem, 'ui-palette-item')} onClick={onClick} title={description}>
    <Flex direction='column' gap={1} alignItems='center'>
      <Flex className={cn(classNames.paletteItemIcon, 'ui-palette-item-icon')} justifyContent='center' alignItems='center'>
        {/* Need to manually set style of icon as the 'paletteItemIvyIcon' icon class name cannot be imported properly. */}
        {typeof icon === 'string' ? <IvyIcon icon={icon} style={{ textAlign: 'center', fontSize: 24 }} /> : icon}
      </Flex>
      <Flex justifyContent='center'>{name}</Flex>
    </Flex>
  </button>
);
