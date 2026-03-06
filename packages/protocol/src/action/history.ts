import { Action, hasArrayProp, hasStringProp, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

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

export interface RequestHistoryAction extends RequestAction<SetHistoryAction> {
  kind: typeof RequestHistoryAction.KIND;
  elementId: string;
}

export namespace RequestHistoryAction {
  export const KIND = 'requestHistory';

  export function is(object: unknown): object is RequestHistoryAction {
    return RequestAction.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }

  export function create(options: { elementId: string; requestId?: string }): RequestHistoryAction {
    return {
      kind: KIND,
      requestId: '',
      ...options
    };
  }
}

export interface SetHistoryAction extends ResponseAction {
  kind: typeof SetHistoryAction.KIND;
  readonly historyNodes: Array<HistoryNode>;
}

export namespace SetHistoryAction {
  export const KIND = 'setHistory';

  export function is(object: unknown): object is SetHistoryAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'historyNodes');
  }
}

export type HistoryNode = {
  type: 'REQUEST_FINISHED' | 'REQUEST_PAUSED' | 'REQUEST_RUNNING' | 'EXECUTION' | 'DATA';
  description: string;
  children: Array<HistoryNode>;
};
