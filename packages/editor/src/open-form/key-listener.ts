import { OpenFormEditorAction } from '@axonivy/process-editor-protocol';
import type { Action, GModelElement } from '@eclipse-glsp/client';
import { KeyListener, matchesKeystroke } from '@eclipse-glsp/client';

export class OpenDataClassKeyListener extends KeyListener {
  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyF')) {
      return [OpenFormEditorAction.create()];
    }
    return [];
  }
}
