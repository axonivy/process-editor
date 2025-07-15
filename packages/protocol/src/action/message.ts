import { Action, hasStringProp } from '@eclipse-glsp/protocol';
import type { CreateOptionHelper } from '../type-helper';

export interface ElementChangedAction extends Action {
  kind: typeof ElementChangedAction.KIND;
  changeKind: 'UNDO' | 'REDO';
  elementId: string;
}

export namespace ElementChangedAction {
  export const KIND = 'elementChange';

  export function is(object: unknown): object is ElementChangedAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId') && hasStringProp(object, 'changeKind');
  }

  export const create: CreateOptionHelper<ElementChangedAction> = options => ({ kind: KIND, ...options });
}
