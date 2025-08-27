import type { MaybePromise, PaletteItem } from '@eclipse-glsp/client';
import { Action } from '@eclipse-glsp/client';
import type { ShowMenuAction } from '../menu/menu';

export interface ShowToolBarMenuAction extends ShowMenuAction {
  kind: typeof ShowToolBarMenuAction.KIND;
  id: string;
  actions: (item: PaletteItem) => Action[];
}

export namespace ShowToolBarMenuAction {
  export const KIND = 'showToolBarMenu';

  export function create(options: {
    id: string;
    paletteItems: () => MaybePromise<Array<PaletteItem>>;
    actions: (item: PaletteItem) => Action[];
    showSearch?: boolean;
    customCssClass?: string;
  }): ShowToolBarMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: unknown): object is ShowToolBarMenuAction {
    return Action.hasKind(object, KIND);
  }
}
