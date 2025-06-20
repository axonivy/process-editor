import {
  Action,
  CenterAction,
  FitToScreenAction,
  GModelElement,
  isViewport,
  matchesKeystroke,
  OriginViewportAction,
  SetUIExtensionVisibilityAction,
  SetViewportAction,
  ZoomKeyListener
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { QuickActionUI } from '../quick-action/quick-action-ui';

@injectable()
export class IvyZoomKeyListener extends ZoomKeyListener {
  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const actions = super.keyDown(element, event);
    // support additional actions through key listeners
    let requiresSetViewportAction = false;
    if (actions.length === 0) {
      if (matchesKeystroke(event, 'KeyM')) {
        actions.push(CenterAction.create(this.selectionService.getSelectedElementIDs()));
        requiresSetViewportAction = true;
      } else if (matchesKeystroke(event, 'KeyF')) {
        actions.push(FitToScreenAction.create(this.selectionService.getSelectedElementIDs()));
        requiresSetViewportAction = true;
      } else if (matchesKeystroke(event, 'KeyO')) {
        actions.push(OriginViewportAction.create());
        requiresSetViewportAction = true;
      }
    }
    if (isViewport(element)) {
      if (requiresSetViewportAction) {
        actions.push(SetViewportAction.create(element.id, element));
      }
      const visibilityAction = SetUIExtensionVisibilityAction.create({
        extensionId: QuickActionUI.ID,
        visible: true,
        contextElementsId: [...this.selectionService.getSelectedElementIDs()]
      });
      actions.push(visibilityAction);
    }
    return actions;
  }
}
