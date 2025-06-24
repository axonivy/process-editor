import {
  Action,
  CenterAction,
  EditorContextService,
  FitToScreenAction,
  GModelElement,
  isViewport,
  matchesKeystroke,
  OriginViewportAction,
  SetViewportAction,
  ZoomKeyListener
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { QuickActionUI } from '../quick-action/quick-action-ui';

@injectable()
export class IvyZoomKeyListener extends ZoomKeyListener {
  @inject(EditorContextService) protected editorContext: EditorContextService;

  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const actions = super.keyDown(element, event);

    // support additional actions through key listeners
    let setViewport = false;
    if (actions.length === 0) {
      if (matchesKeystroke(event, 'KeyM')) {
        actions.push(CenterAction.create(this.selectionService.getSelectedElementIDs()));
        setViewport = true;
      } else if (matchesKeystroke(event, 'KeyF')) {
        actions.push(FitToScreenAction.create(this.selectionService.getSelectedElementIDs()));
        setViewport = true;
      } else if (matchesKeystroke(event, 'KeyO')) {
        actions.push(OriginViewportAction.create());
        setViewport = true;
      }
    }
    if (actions.length === 0) {
      // no keystroke matched
      return actions;
    }
    const model = this.editorContext.modelRoot;
    if (isViewport(model)) {
      actions.push(QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]));
      if (setViewport) {
        actions.push(SetViewportAction.create(model.id, model));
      }
    }
    return actions;
  }
}
