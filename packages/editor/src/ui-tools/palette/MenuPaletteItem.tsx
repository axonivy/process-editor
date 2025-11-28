import { cn, Flex, type PaletteItemConfig, type PaletteItemProps } from '@axonivy/ui-components';
import React from 'react';
import './MenuPaletteItem.css';

export type MenuPaletteItemConfig = PaletteItemConfig & {
  paletteIcon: React.ReactNode;
  info?: string;
};

type MenuPaletteItemProps = PaletteItemProps<MenuPaletteItemConfig> & {
  horizontal?: boolean;
};

export const MenuPaletteItem = ({ name, description, paletteIcon, info, onClick, classNames, horizontal }: MenuPaletteItemProps) => (
  <button
    className={cn(classNames.paletteItem, 'ui-palette-item')}
    onClick={onClick}
    title={description}
    data-style={horizontal ? 'horizontal' : 'vertical'}
  >
    <Flex gap={1} alignItems='center' direction='column' className='ui-palette-item-content'>
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
