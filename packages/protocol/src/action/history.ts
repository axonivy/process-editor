import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export interface EnableHistoryAction extends Action {
  kind: typeof EnableHistoryAction.KIND;
}

export namespace EnableHistoryAction {
  export const KIND = 'enableHistory';

  export function is(object: unknown): object is EnableHistoryAction {
    return Action.hasKind(object, KIND);
  }

  export function create(): EnableHistoryAction {
    return { kind: KIND };
  }
}

export interface ShowHistoryAction extends Action {
  kind: typeof ShowHistoryAction.KIND;
  elementId: string;
}

export namespace ShowHistoryAction {
  export const KIND = 'showHistory';

  export function is(object: unknown): object is ShowHistoryAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }

  export function create(elementId: string): ShowHistoryAction {
    return { kind: KIND, elementId };
  }
}
