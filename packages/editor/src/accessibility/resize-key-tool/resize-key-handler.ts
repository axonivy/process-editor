import {
  Action,
  getElements,
  isResizable,
  isSelectableAndBoundsAware,
  ResizeElementAction,
  ResizeElementHandler,
  SelectionService
} from '@eclipse-glsp/client';
import { inject } from 'inversify';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';

export class IvyResizeElementHandler extends ResizeElementHandler {
  @inject(SelectionService) protected selectionService!: SelectionService;

  override handle(action: Action) {
    // customization: Check if we have exactly one element that is resizable before showing any feedback
    // addition: show quick action UI
    if (ResizeElementAction.is(action) && action.elementIds.length === 1) {
      const firstElement = getElements(this.editorContextService.modelRoot.index, action.elementIds, isSelectableAndBoundsAware)[0];
      if (firstElement && isResizable(firstElement)) {
        this.handleResizeElement(action);
        return QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]);
      }
    }
    return;
  }
}
