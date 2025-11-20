import type { Action, MaybePromise, PaletteItem } from '@eclipse-glsp/client';

export interface ShowMenuAction extends Action {
  paletteItems: () => MaybePromise<Array<PaletteItem>>;
  showSearch?: boolean;
  customCssClass?: string;
}
