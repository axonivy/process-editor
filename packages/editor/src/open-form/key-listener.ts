import { OpenFormEditorAction } from '@axonivy/process-editor-protocol';
import { type Action, type GModelElement, KeyListener, matchesKeystroke } from '@eclipse-glsp/client';

export class OpenDataClassKeyListener extends KeyListener {
  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyF')) {
      return [OpenFormEditorAction.create()];
    }
    return [];
  }
}
