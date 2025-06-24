import {
  Action,
  getElements,
  isResizable,
  isSelectableAndBoundsAware,
  ResizeElementAction,
  ResizeElementHandler,
  SelectionService
} from '@eclipse-glsp/client';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';
import { inject } from 'inversify';

export class IvyResizeElementHandler extends ResizeElementHandler {
  @inject(SelectionService) protected selectionService: SelectionService;

  handle(action: Action) {
    // customization: Check if we have exactly one element that is resizable before showing any feedback
    // addition: show quick action UI
    if (ResizeElementAction.is(action) && action.elementIds.length === 1) {
      const elements = getElements(this.editorContextService.modelRoot.index, action.elementIds, isSelectableAndBoundsAware);
      if (elements.length === 1 && isResizable(elements[0])) {
        this.handleResizeElement(action);
        return QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]);
      }
    }
    return;
  }
}
