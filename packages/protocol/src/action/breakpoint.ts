import { Action, hasArrayProp, hasBooleanProp, hasStringProp } from '@eclipse-glsp/protocol';

export interface SetBreakpointAction extends Action {
  kind: typeof SetBreakpointAction.KIND;
  elementId: string;
}

export namespace SetBreakpointAction {
  export const KIND = 'setBreakpoint';

  export function create(options: { elementId: string }): SetBreakpointAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: unknown): object is SetBreakpointAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }
}

export interface ToggleBreakpointAction extends Action {
  kind: typeof ToggleBreakpointAction.KIND;
  elementId: string;
  disable: boolean;
}

export namespace ToggleBreakpointAction {
  export const KIND = 'toggleBreakpoint';

  export function create(options: { elementId: string; disable: boolean }): ToggleBreakpointAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: unknown): object is ToggleBreakpointAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId') && hasBooleanProp(object, 'disable');
  }
}

export interface ElementBreakpoint {
  elementId: string;
  condition: string;
  disabled: boolean;
}

export interface ShowBreakpointAction extends Action {
  kind: typeof ShowBreakpointAction.KIND;
  elementBreakpoints: ElementBreakpoint[];
  globalDisabled: boolean;
}

export namespace ShowBreakpointAction {
  export const KIND = 'showBreakpoints';

  export function is(object: unknown): object is ShowBreakpointAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'elementBreakpoints') && hasBooleanProp(object, 'globalDisabled');
  }

  export function create(options: { elementBreakpoints: ElementBreakpoint[]; globalDisabled: boolean }): ShowBreakpointAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
