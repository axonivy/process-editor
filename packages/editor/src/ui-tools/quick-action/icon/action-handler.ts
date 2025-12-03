import {
  PaletteItem,
  RequestContextActions,
  SetContextActions,
  TYPES,
  type GModelElement,
  type IActionDispatcher
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { elementIcons, type StandardIcon } from '../../../diagram/icon/icons';
import { EventBoundaryTypes, EventEndTypes, EventIntermediateTypes, EventStartTypes, GatewayTypes } from '../../../diagram/view-types';

const NO_DEFAULT_ICON: PaletteItem = {
  id: 'std:NoDecorator',
  icon: 'std:NoDecorator',
  label: 'No Icon',
  sortString: '9999',
  actions: []
} as const;

@injectable()
export class IconPaletteHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  getPaletteItems(element: GModelElement) {
    return () =>
      new Promise<Array<PaletteItem>>(resolve => {
        this.actionDispatcher
          .request(RequestContextActions.create({ contextId: 'ivy-tool-icon-palette', editorContext: { selectedElementIds: [] } }))
          .then(response => {
            if (SetContextActions.is(response)) {
              const paletteItems = response.actions.map(e => e as PaletteItem);
              resolve([this.defaultIcons(element.type), ...paletteItems, this.standardIcons(element.type)]);
            }
          });
      });
  }

  defaultIcons(elementType: string) {
    const icon = elementIcons[elementType] || '';
    let label = icon.substring(icon.indexOf(':') + 1);
    if (!label) {
      label = 'No Icon';
    }
    const defaultIconGroup: PaletteItem = {
      id: 'default',
      label: 'Default',
      sortString: 'A',
      actions: [],
      children: [{ id: 'default', label, icon, sortString: '0000', actions: [] }]
    };
    if (icon) {
      defaultIconGroup.children?.push(NO_DEFAULT_ICON);
    }
    return defaultIconGroup;
  }

  standardIcons(elementType: string) {
    const stdIcons = standardIconsForElementKind(elementType).map<PaletteItem>(icon => ({
      id: icon,
      label: icon.substring(icon.indexOf(':') + 1),
      icon,
      sortString: '0',
      actions: []
    }));
    const standardIconGroup: PaletteItem = {
      id: 'standard',
      label: 'Standard Icons',
      sortString: 'C',
      actions: [],
      children: stdIcons
    };
    return standardIconGroup;
  }
}

const DEFAULT_START_EVENT_ICONS: Array<StandardIcon> = [
  'std:Message',
  'std:Timer',
  'std:Condition',
  'std:Signal',
  'std:Error',
  'std:Escalation',
  'std:Compensate'
] as const;

const DEFAULT_END_EVENT_ICONS: Array<StandardIcon> = [
  'std:Terminate',
  'std:MessageThrow',
  'std:EscalationThrow',
  'std:ErrorThrow',
  'std:SignalThrow',
  'std:CompensateThrow'
] as const;

const DEFAULT_INTERMEDIATE_EVENT_ICONS: Array<StandardIcon> = [
  'std:Message',
  'std:Timer',
  'std:Condition',
  'std:Signal',
  'std:SignalThrow',
  'std:EscalationThrow',
  'std:MessageThrow',
  'std:Link',
  'std:LinkThrow'
] as const;

const DEFAULT_BOUNDARY_EVENT_ICONS: Array<StandardIcon> = [
  'std:Message',
  'std:Error',
  'std:Timer',
  'std:Escalation',
  'std:Condition',
  'std:Signal'
] as const;

const DEFAULT_GATEWAY_ICONS: Array<StandardIcon> = [
  'std:Alternative',
  'std:Split',
  'std:Inclusive',
  'std:Complex',
  'std:EventBased'
] as const;

export const standardIconsForElementKind = (elementType: string): Array<StandardIcon> => {
  if (elementType.startsWith(EventStartTypes.DEFAULT)) {
    return DEFAULT_START_EVENT_ICONS;
  }
  if (elementType.startsWith(EventEndTypes.DEFAULT)) {
    return DEFAULT_END_EVENT_ICONS;
  }
  if (elementType.startsWith(EventIntermediateTypes.DEFAULT)) {
    return DEFAULT_INTERMEDIATE_EVENT_ICONS;
  }
  if (elementType.startsWith(EventBoundaryTypes.DEFAULT)) {
    return DEFAULT_BOUNDARY_EVENT_ICONS;
  }
  if (elementType.startsWith(GatewayTypes.DEFAULT)) {
    return DEFAULT_GATEWAY_ICONS;
  }
  return [];
};
