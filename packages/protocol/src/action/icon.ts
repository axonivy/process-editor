import { Action, type Operation, type PaletteItem } from '@eclipse-glsp/protocol';

export interface ChangeIconOperation extends Operation {
  kind: typeof ChangeIconOperation.KIND;
  elementId: string;
  icon?: string;
}

export namespace ChangeIconOperation {
  export const KIND = 'changeIcon';

  export function changeIcon(options: { elementId: string; icon: string }): ChangeIconOperation {
    return create(options);
  }

  export function deleteIcon(options: { elementId: string }): ChangeIconOperation {
    return create(options);
  }

  export function create(options: { elementId: string; icon?: string }): ChangeIconOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export interface UpdateIconPaletteAction extends Action {
  kind: typeof UpdateIconPaletteAction.KIND;
  paletteItems: PaletteItem[];
}

export namespace UpdateIconPaletteAction {
  export const KIND = 'updateIconPalette';

  export function is(object: unknown): object is UpdateIconPaletteAction {
    return Action.hasKind(object, KIND);
  }
}
