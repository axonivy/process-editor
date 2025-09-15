import { OpenQuickOutlineAction } from '@axonivy/process-editor-protocol';
import type { Action, GModelElement } from '@eclipse-glsp/client';
import { KeyListener } from '@eclipse-glsp/client';

export class OpenQuickOutlineKeyListener extends KeyListener {
  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (event.ctrlKey && event.key === 'o') {
      return [OpenQuickOutlineAction.create()];
    }
    return [];
  }
}
