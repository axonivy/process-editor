import type { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export interface SetDirtyStateAction extends Action {
  kind: typeof SetDirtyStateAction.KIND;
  isDirty: boolean;
  reason: string;
}

export namespace SetDirtyStateAction {
  export const KIND = 'setDirtyState';

  export function create(options: { isDirty: boolean; reason: string }): SetDirtyStateAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class SetDirtyStateActionHandler implements IActionHandler {
  handle(action: SetDirtyStateAction): void {
    const url = document.URL;
    let processName = url.substring(url.lastIndexOf('/') + 1);
    if (action.isDirty) {
      processName = '* ' + processName;
    }
    document.title = processName;
  }
}
