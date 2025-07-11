import type { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export interface StandaloneShowBreakpointAction extends Action {
  kind: typeof StandaloneShowBreakpointAction.KIND;
}

export namespace StandaloneShowBreakpointAction {
  export const KIND = 'showBreakpoints';

  export function create(): StandaloneShowBreakpointAction {
    return {
      kind: KIND
    };
  }
}

@injectable()
export class StandaloneShowBreakpointActionHandler implements IActionHandler {
  handle() {
    return;
  }
}
