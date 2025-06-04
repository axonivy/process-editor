import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import type { Action, GModelElement } from '@eclipse-glsp/client';
import { InvokeCopyPasteAction, KeyListener } from '@eclipse-glsp/client';

export class CopyPasteKeyListener extends KeyListener {
  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    // if (matchesKeystroke(event, 'KeyC', 'ctrlCmd')) {
    //   return [InvokeCopyPasteAction.create('copy')];
    // }
    // if (matchesKeystroke(event, 'KeyV', 'ctrlCmd')) {
    //   return [InvokeCopyPasteAction.create('paste')];
    // }
    if (matchesKeystroke(event, 'KeyX', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('cut')];
    }
    return [];
  }
}
