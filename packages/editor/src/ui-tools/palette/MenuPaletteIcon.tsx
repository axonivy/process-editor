import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import React from 'react';
import { elementIcons, standardIcons, type StandardIcon } from '../../diagram/icon/icons';
import {
  ActivityTypes,
  EventBoundaryTypes,
  EventEndTypes,
  EventIntermediateTypes,
  EventStartTypes,
  GatewayTypes,
  LaneTypes
} from '../../diagram/view-types';
import type { ExtendedPaletteItem } from './palette-utils';

export const MenuPaletteIcon = ({ item }: { item: ExtendedPaletteItem }) => {
  const iconUri = item.icon;
  if (!iconUri) {
    return <i />;
  }

  if (iconUri.includes('/faces/javax.faces.resource')) {
    return <img style={{ height: 26, width: 26, objectFit: 'contain' }} src={iconUri} alt={item.label} />;
  }

  const elementIcon = menuIcons[iconUri];
  if (elementIcon) {
    return <IvyIcon icon={elementIcon} style={{ textAlign: 'center', fontSize: 26 }} />;
  }

  if (iconUri.startsWith('std:')) {
    return (
      <svg viewBox='0 0 20 20' height={26} width={26} style={{ border: 'none', width: 26, height: 26 }}>
        <path style={{ fill: 'currentcolor' }} d={standardIcons[iconUri as StandardIcon]} />
      </svg>
    );
  }

  const baseSymbol = getBaseSymbol(iconUri);
  if (baseSymbol) {
    return (
      <svg viewBox='0 0 28 28' height={28} width={28} style={{ border: 'none', width: 28, height: 28 }}>
        {baseSymbol}
        <svg viewBox='0 0 20 20' height={18} width={18} x={5} y={5} style={{ border: 'none', width: 18, height: 18 }}>
          <path style={{ fill: 'currentcolor' }} d={path(iconUri)} />
        </svg>
      </svg>
    );
  }

  return <i />;
};

const menuIcons: Record<string, IvyIcons> = {
  [ActivityTypes.COMMENT]: IvyIcons.Note,
  [LaneTypes.POOL]: IvyIcons.PoolSwimlanes,
  [LaneTypes.LANE]: IvyIcons.LaneSwimlanes
} as const;

const getBaseSymbol = (iconUri: string) => {
  if (iconUri.startsWith(EventStartTypes.DEFAULT)) {
    return <circle cx='14' cy='14' r='13' style={{ fill: 'none', stroke: 'currentcolor' }} />;
  }
  if (iconUri.startsWith(EventIntermediateTypes.DEFAULT) || iconUri.startsWith(EventBoundaryTypes.DEFAULT)) {
    return (
      <>
        <circle cx='14' cy='14' r='13' style={{ fill: 'none', stroke: 'currentcolor' }} />
        <circle cx='14.2' cy='14.2' r='11' style={{ fill: 'none', stroke: 'currentcolor' }} />
      </>
    );
  }
  if (iconUri.startsWith(EventEndTypes.DEFAULT)) {
    return <circle cx='14' cy='14' r='13' style={{ fill: 'none', stroke: 'currentcolor', strokeWidth: '2' }} />;
  }
  if (iconUri.startsWith(GatewayTypes.DEFAULT)) {
    return <polygon points='14,0 28,14 14,28 0,14' style={{ fill: 'none', stroke: 'currentcolor' }} />;
  }
  if (iconUri.startsWith(ActivityTypes.DEFAULT)) {
    if (iconUri === ActivityTypes.EMBEDDED_PROCESS || iconUri.endsWith('BpmnElement')) {
      return <rect x='1' y='1' width='26' height='26' rx='2' ry='2' style={{ fill: 'none', stroke: 'currentcolor', strokeDasharray: 4 }} />;
    }
    return <rect x='1' y='1' width='26' height='26' rx='2' ry='2' style={{ fill: 'none', stroke: 'currentcolor' }} />;
  }
};

const path = (iconUri: string) => {
  const stdIcon = elementIcons[iconUri];
  if (stdIcon) {
    return standardIcons[stdIcon];
  }
  if (iconUri === ActivityTypes.BPMN_GENERIC || iconUri === ActivityTypes.SUB_PROCESS || iconUri === ActivityTypes.EMBEDDED_PROCESS) {
    return standardIcons['std:Join'];
  }
  if (
    iconUri.startsWith(ActivityTypes.THIRD_PARTY) ||
    iconUri.startsWith(EventStartTypes.START_THIRD_PARTY) ||
    iconUri.startsWith(EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY)
  ) {
    return standardIcons['other:Puzzle'];
  }
  return '';
};
