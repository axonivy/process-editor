import {
  SetBreakpointAction,
  ShowBreakpointAction,
  ToggleBreakpointAction,
  type ElementBreakpoint
} from '@axonivy/process-editor-protocol';
import { TYPES, type Action, type IActionDispatcher, type IActionHandler } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class StandaloneShowBreakpointActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher!: IActionDispatcher;

  breakpoints: Array<ElementBreakpoint> = [];

  handle(action: Action) {
    if (SetBreakpointAction.is(action)) {
      const index = this.breakpoints.findIndex(bp => bp.elementId === action.elementId);
      if (index !== -1) {
        this.breakpoints.splice(index, 1);
      } else {
        this.breakpoints.push({ elementId: action.elementId, condition: '', disabled: false });
      }
      this.actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: this.breakpoints, globalDisabled: false }));
    }
    if (ToggleBreakpointAction.is(action)) {
      const bp = this.breakpoints.find(bp => bp.elementId === action.elementId);
      if (bp) {
        bp.disabled = action.disable;
      }
      this.actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: this.breakpoints, globalDisabled: false }));
    }
  }
}
