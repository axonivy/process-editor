import { KeyListener, matchesKeystroke, SaveModelAction, type GModelElement } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { SetDirtyStateActionHandler } from './action-handler';

@injectable()
export class SaveListener extends KeyListener {
  @inject(SetDirtyStateActionHandler) protected dirtyHandler!: SetDirtyStateActionHandler;

  override keyDown(element: GModelElement, event: KeyboardEvent) {
    if (matchesKeystroke(event, 'KeyS', 'ctrlCmd') && this.dirtyHandler.isDirty()) {
      return [SaveModelAction.create()];
    } else {
      return [];
    }
  }
}
