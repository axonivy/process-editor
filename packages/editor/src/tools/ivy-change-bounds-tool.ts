import type { Action, GModelElement, KeyListener, TrackedElementResize, TrackedResize } from '@eclipse-glsp/client';
import {
  Bounds,
  boundsFeature,
  ChangeBoundsListener,
  ChangeBoundsTool,
  GChildElement,
  isMoveable,
  ResizeHandleLocation,
  SetBoundsFeedbackAction,
  SetUIExtensionVisibilityAction
} from '@eclipse-glsp/client';
import { MoveElementKeyListener } from '@eclipse-glsp/client/lib/features/change-bounds/move-element-key-listener';
import { injectable } from 'inversify';
import { LaneNode } from '../diagram/model';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';

@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected override createChangeBoundsListener() {
    return new IvyChangeBoundsListener(this);
  }

  createMoveKeyListener(): KeyListener {
    return new IvyMoveElementKeyListener(this.selectionService, this.changeBoundsManager, this.grid);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  override mouseDown(target: GModelElement, event: MouseEvent) {
    if (this.activeResizeElement && this.activeResizeElement instanceof LaneNode) {
      // We still have an active lane resize element (move), so we don't need to reevaluate it.
      // This may happens because the mouse left the window.
      return [];
    }
    return super.mouseDown(target, event);
  }

  protected resizeBoundsAction(resize: TrackedResize) {
    const elementResizes = resize.elementResizes.filter(elementResize => elementResize.valid.size);
    if (this.isLaneMove(resize, elementResizes)) {
      this.changeLaneResizeToMove(elementResizes[0]);
    }
    return SetBoundsFeedbackAction.create(elementResizes.map(elementResize => this.toElementAndBounds(elementResize)));
  }

  private isLaneMove(resize: TrackedResize, elementResizes: Array<TrackedElementResize>) {
    return (
      elementResizes.length === 1 &&
      elementResizes[0].element instanceof LaneNode &&
      resize.handleMove.element.location === ResizeHandleLocation.Top
    );
  }

  private changeLaneResizeToMove(elementResize: TrackedElementResize) {
    elementResize.toBounds = { ...elementResize.fromBounds, ...Bounds.position(elementResize.toBounds) };
  }
}

export class IvyMoveElementKeyListener extends MoveElementKeyListener {
  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const actions = super.keyDown(element, event);
    if (actions.length === 0) {
      return actions;
    }
    let selectedElements = this.selectionService.getSelectedElements().filter(element => isMoveable(element));
    selectedElements = selectedElements.filter(e => !this.isChildOfSelected(selectedElements, e)).filter(e => e.hasFeature(boundsFeature));
    if (selectedElements.length === 0) {
      return actions;
    }
    return [
      ...actions,
      SetUIExtensionVisibilityAction.create({
        extensionId: QuickActionUI.ID,
        visible: true,
        contextElementsId: [...selectedElements.map(e => e.id)]
      })
    ];
  }

  protected isChildOfSelected(selectedElements: GModelElement[], element: GModelElement): boolean {
    return element instanceof GChildElement && selectedElements.includes(element.parent);
  }
}
