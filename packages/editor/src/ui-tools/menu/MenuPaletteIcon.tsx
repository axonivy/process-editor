import { IvyIcon } from '@axonivy/ui-components';
import type { IvyIcons } from '@axonivy/ui-icons';
import React from 'react';
import { ActivityTypes, EventIntermediateTypes, EventStartTypes } from '../../diagram/view-types';
import { IconStyle, MenuIcons, resolveIcon } from './icons';
import type { ExtendedPaletteItem } from './menu-utils';

export const MenuPaletteIcon = ({ item }: { item: ExtendedPaletteItem }) => {
  if (!item.icon) {
    return <i />;
  }
  const ivyIcon = createPaletteIcon(item.icon);
  if (ivyIcon.style === IconStyle.SI) {
    return <IvyIcon icon={ivyIcon.res as IvyIcons} style={{ textAlign: 'center', fontSize: 24 }} />;
  }
  if (ivyIcon.style === IconStyle.SVG) {
    return (
      <svg class-sprotty-icon-svg viewBox='0 0 20 20' height={24} width={24} style={{ border: 'none', width: 24, height: 24 }}>
        <path style={{ fill: 'currentcolor' }} d={ivyIcon.res as string} />
      </svg>
    );
  }
  if (ivyIcon.style === IconStyle.IMG) {
    return (
      <span className='sprotty-icon'>
        <img src={item.icon} alt={item.label} />
      </span>
    );
  }
  return <i />;
};

function createPaletteIcon(icon: string) {
  if (icon.startsWith(ActivityTypes.THIRD_PARTY)) {
    return { res: MenuIcons.get(ActivityTypes.THIRD_PARTY), style: IconStyle.SI };
  }
  if (icon.startsWith(EventStartTypes.START_THIRD_PARTY)) {
    return { res: MenuIcons.get(EventStartTypes.START_THIRD_PARTY), style: IconStyle.SI };
  }
  if (icon.startsWith(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY)) {
    return { res: MenuIcons.get(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY), style: IconStyle.SI };
  }
  return resolveIcon(icon);
}
