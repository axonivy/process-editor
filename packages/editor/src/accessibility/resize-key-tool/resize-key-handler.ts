import {
  Action,
  getElements,
  isResizable,
  isSelectableAndBoundsAware,
  ResizeElementAction,
  ResizeElementHandler,
  SelectionService,
  SetUIExtensionVisibilityAction
} from '@eclipse-glsp/client';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';
import { inject } from 'inversify';

export class IvyResizeElementHandler extends ResizeElementHandler {
  @inject(SelectionService) protected selectionService: SelectionService;

  handle(action: Action) {
    if (ResizeElementAction.is(action) && action.elementIds.length === 1) {
      const elements = getElements(this.editorContextService.modelRoot.index, action.elementIds, isSelectableAndBoundsAware);
      if (elements.length === 1 && isResizable(elements[0])) {
        this.handleResizeElement(action);
        return SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: true,
          contextElementsId: [...this.selectionService.getSelectedElementIDs()]
        });
      }
    }
    return;
  }
}
