import type { Action } from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { InvokeActionHandler } from '../InvokeActionHandler';

export class InvokeSelectAllAction implements Action {
  static KIND = 'invoke-select-all';
  readonly kind = InvokeSelectAllAction.KIND;
}

export function isInvokeSelectAllAction(action: Action): action is InvokeSelectAllAction {
  return action.kind === InvokeSelectAllAction.KIND;
}

@injectable()
export class IvyInvokeSelectAllActionHandler extends InvokeActionHandler {
  handle(action: Action): void {
    if (isInvokeSelectAllAction(action) && this.isDiagramActive()) {
      this.actionDispatcher.dispatch(SelectAllAction.create(true));
    }
  }
}
