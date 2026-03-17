import { type Action, type IActionHandler } from '@eclipse-glsp/client';
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
  private dirty = false;

  handle(action: SetDirtyStateAction): void {
    this.dirty = false;
    const url = document.URL;
    let processName = url.substring(url.lastIndexOf('/') + 1);
    if (action.isDirty) {
      this.dirty = true;
      processName = '* ' + processName;
    }
    document.title = processName;
  }

  isDirty(): boolean {
    return this.dirty;
  }
}
