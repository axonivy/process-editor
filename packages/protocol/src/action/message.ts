import { Action, hasStringProp } from '@eclipse-glsp/protocol';
import type { CreateOptionHelper } from '../type-helper';

export interface ElementMessageAction extends Action {
  kind: typeof ElementMessageAction.KIND;
  message: string;
  elementId: string;
}

export namespace ElementMessageAction {
  export const KIND = 'elementMessage';

  export function is(object: unknown): object is ElementMessageAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId') && hasStringProp(object, 'message');
  }

  export const create: CreateOptionHelper<ElementMessageAction> = options => ({ kind: KIND, ...options });
}
