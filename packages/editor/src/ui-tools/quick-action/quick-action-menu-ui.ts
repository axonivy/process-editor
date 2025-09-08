import type { GIssueMarker, JsonAny, PaletteItem } from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/client';
import type { MenuPaletteItem } from '../../utils/menu-utils';
import type { ShowMenuAction } from '../menu/menu';

export interface ShowQuickActionMenuAction<T extends PaletteItem = MenuPaletteItem> extends ShowMenuAction {
  kind: typeof ShowQuickActionMenuAction.KIND;
  elementIds: string[];
  paletteItems: () => Array<T>;
  actions: (item: T, elementIds: string[]) => Action[];
  isEditable?: boolean;
}

export namespace ShowQuickActionMenuAction {
  export const KIND = 'showQuickActionMenu';

  export function create<T extends PaletteItem = MenuPaletteItem>(options: {
    elementIds: string[];
    paletteItems: () => T[];
    actions: (item: T, elementIds: string[]) => Action[];
    showSearch?: boolean;
    customCssClass?: string;
    isEditable?: boolean;
  }): ShowQuickActionMenuAction<T> {
    return {
      kind: KIND,
      ...options
    };
  }

  export function empty<T extends PaletteItem = MenuPaletteItem>(): ShowQuickActionMenuAction<T> {
    return create<T>({
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
