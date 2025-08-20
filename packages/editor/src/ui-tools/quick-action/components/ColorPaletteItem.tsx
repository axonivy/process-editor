import { cn, Flex, IvyIcon, type PaletteItemConfig, type PaletteItemProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { PaletteItem } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';

export type ColorPaletteItem = PaletteItem;

export function isNewColorPaletteItem(item: ColorPaletteItem): boolean {
  return item.id === 'new.color';
}

export function isDefaultColorPaletteItem(item: ColorPaletteItem): boolean {
  return item.label === 'default';
}

export function newColorPaletteItem(): ColorPaletteItem {
  return {
    id: 'colors',
    icon: 'colors',
    label: 'Colors',
    sortString: 'A',
    actions: [],
    children: [
      {
        id: 'new.color',
        label: t('label.colorNew'),
        icon: IvyIcons.Plus,
        sortString: '9999',
        actions: []
      }
    ]
  };
}

export type ColorPaletteItemConfig = PaletteItemConfig & {
  isNewColor: boolean;
  isDefaultColor: boolean;
  isEditable: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onEditColor?: (e: React.MouseEvent) => void;
  source: ColorPaletteItem;
};

export const colorItemToConfig = (
  item: ColorPaletteItem,
  action: ShowQuickActionMenuAction,
  onClick: (item: ColorPaletteItem) => void,
  onEdit: (item: ColorPaletteItem) => void
): ColorPaletteItemConfig => {
  const isNewColor = isNewColorPaletteItem(item);
  const isDefaultColor = isDefaultColorPaletteItem(item);
  return {
    name: item.label,
    description: item.label,
    icon: (item.icon || 'var(--glsp-foreground)') as IvyIcons,
    onClick: (event?: React.MouseEvent) => {
      event?.stopPropagation();
      onClick(item);
    },
    isNewColor,
    isDefaultColor,
    onEditColor: event => {
      event.stopPropagation();
      onEdit(item);
    },
    isEditable: !!action.isEditable && !isDefaultColor && !isNewColor,
    source: item
  };
};

type ColorPaletteItemProps = PaletteItemProps<ColorPaletteItemConfig>;

export const ColorPaletteItem: React.FC<ColorPaletteItemProps> = ({
  name,
  description,
  icon,
  onClick,
  classNames,
  isNewColor,
  isDefaultColor,
  isEditable,
  onEditColor
}) => {
  const canEdit = isEditable && !isDefaultColor && !isNewColor;
  return (
    <button
      className={cn(classNames.paletteItem, 'ui-palette-color-item', 'ui-palette-item', isNewColor ? 'new-color' : '')}
      onClick={onClick}
      title={description}
    >
      <Flex direction='column' gap={1} alignItems='center'>
        <Flex className={cn(classNames.paletteItemIcon, 'ui-palette-item-icon')} justifyContent='center' alignItems='center'>
          {isNewColor ? (
            <IvyIcon icon={(icon as IvyIcons) ?? IvyIcons.Plus} className='new-color-icon' />
          ) : (
            <span className='color-icon' style={{ backgroundColor: icon }}></span>
          )}
        </Flex>
        <Flex
          justifyContent='center'
          gap={2}
          onClick={canEdit ? onEditColor : undefined}
          data-function={canEdit ? 'edit-color' : undefined}
        >
          {canEdit ? (
            <>
              <IvyIcon icon={IvyIcons.Edit} />
              <span title={t('label.colorEdit')} style={{ fontSize: '10px', height: '10px' }}>
                {name}
              </span>
            </>
          ) : (
            <span>{name}</span>
          )}
        </Flex>
      </Flex>
    </button>
  );
};
