import type { GIssueMarker, JsonAny, PaletteItem } from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/client';
import type { ShowMenuAction } from '../menu/menu';

export interface ShowQuickActionMenuAction extends ShowMenuAction {
  kind: typeof ShowQuickActionMenuAction.KIND;
  elementIds: string[];
  actions: (item: PaletteItem, elementIds: string[]) => Action[];
  isEditable?: boolean;
}

export namespace ShowQuickActionMenuAction {
  export const KIND = 'showQuickActionMenu';

  export function create(options: {
    elementIds: string[];
    paletteItems: () => PaletteItem[];
    actions: (item: PaletteItem, elementIds: string[]) => Action[];
    showSearch?: boolean;
    customCssClass?: string;
    isEditable?: boolean;
  }): ShowQuickActionMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function empty(): ShowQuickActionMenuAction {
    return create({
      elementIds: [],
      paletteItems: () => [],
      actions: () => []
    });
  }

  export function is(object: unknown): object is ShowQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

export interface ShowInfoQuickActionMenuAction extends Action {
  kind: typeof ShowInfoQuickActionMenuAction.KIND;
  elementId: string;
  markers: GIssueMarker[];
  title?: string;
  text?: string;
  info?: JsonAny;
}

export namespace ShowInfoQuickActionMenuAction {
  export const KIND = 'showSimpleQuickActionMenu';

  export function create(options: {
    elementId: string;
    markers: GIssueMarker[];
    title?: string;
    text?: string;
    info?: JsonAny;
  }): ShowInfoQuickActionMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: unknown): object is ShowInfoQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}
