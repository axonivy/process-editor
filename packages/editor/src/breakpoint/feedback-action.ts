import { type ElementBreakpoint, ToggleBreakpointAction } from '@axonivy/process-editor-protocol';
import {
  Action,
  Command,
  type CommandExecutionContext,
  GChildElement,
  GModelElement,
  GModelRoot,
  MouseListener,
  TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { SChildElementImpl } from 'sprotty';
import { addBreakpointHandles, type Breakable, isBreakable, removeBreakpointHandles, SBreakpointHandle } from './model';

export interface BreakpointFeedbackAction extends Action {
  kind: typeof BreakpointFeedbackCommand.KIND;
  breakpoints: ElementBreakpoint[];
  globalDisabled?: boolean;
}

export namespace BreakpointFeedbackAction {
  export function create(options: { breakpoints: ElementBreakpoint[]; globalDisabled?: boolean }): BreakpointFeedbackAction {
    return {
      kind: BreakpointFeedbackCommand.KIND,
      ...options
    };
  }
}

@injectable()
export class BreakpointFeedbackCommand extends Command {
  static readonly KIND = 'elementBreakpointFeedback';

  protected showBreakpoints: { element: GChildElement & Breakable; condition: string; disabled: boolean; globalDisabled: boolean }[] = [];

  constructor(@inject(TYPES.Action) protected readonly action: BreakpointFeedbackAction) {
    super();
  }

  execute(context: CommandExecutionContext): GModelRoot {
    context.root.index
      .all()
      .filter(e => e instanceof SBreakpointHandle)
      .filter(e => e instanceof SChildElementImpl)
      .forEach(e => {
        removeBreakpointHandles((e as SChildElementImpl).parent);
      });
    this.action.breakpoints.forEach(breakpoint => {
      const element = context.root.index.getById(breakpoint.elementId);
      if (element instanceof GChildElement && isBreakable(element)) {
        this.showBreakpoints.push({
          element: element,
          condition: breakpoint.condition,
          disabled: breakpoint.disabled,
          globalDisabled: this.action.globalDisabled ?? false
        });
      }
    });
    return this.redo(context);
  }

  undo(context: CommandExecutionContext): GModelRoot {
    for (const breakpoint of this.showBreakpoints) {
      removeBreakpointHandles(breakpoint.element);
    }
    return context.root;
  }

  redo(context: CommandExecutionContext): GModelRoot {
    for (const element of this.showBreakpoints) {
      addBreakpointHandles(element.element, element.condition, element.disabled, element.globalDisabled);
    }
    return context.root;
  }
}

@injectable()
export class BreakpointMouseListener extends MouseListener {
  override mouseUp(target: GModelElement): (Action | Promise<Action>)[] {
    if (target instanceof SBreakpointHandle) {
      return [ToggleBreakpointAction.create({ elementId: target.parent.id, disable: !target.disabled })];
    }
    return [];
  }
}
