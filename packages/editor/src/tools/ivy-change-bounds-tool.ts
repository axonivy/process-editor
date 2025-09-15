import type { Action, GModelElement, KeyListener, TrackedElementResize, TrackedResize } from '@eclipse-glsp/client';
import {
  Bounds,
  ChangeBoundsListener,
  ChangeBoundsTool,
  Direction,
  GChildElement,
  isMoveable,
  isSizeable,
  MoveElementRelativeAction,
  ResizeHandleLocation,
  SetBoundsFeedbackAction
} from '@eclipse-glsp/client';
import { MoveElementKeyListener } from '@eclipse-glsp/client/lib/features/change-bounds/move-element-key-listener';
import { injectable } from 'inversify';
import { LaneNode } from '../diagram/model';
import { isLaneResizable } from '../lanes/model';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';

@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected override createChangeBoundsListener() {
    return new IvyChangeBoundsListener(this);
  }

  override createMoveKeyListener(): KeyListener {
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

  protected override resizeBoundsAction(resize: TrackedResize) {
    const elementResizes = resize.elementResizes.filter(elementResize => elementResize.valid.size);
    const firstElementResize = elementResizes[0];
    if (firstElementResize && this.isLaneMove(resize, firstElementResize)) {
      this.changeLaneResizeToMove(firstElementResize);
    }
    return SetBoundsFeedbackAction.create(elementResizes.map(elementResize => this.toElementAndBounds(elementResize)));
  }

  private isLaneMove(resize: TrackedResize, elementResize: TrackedElementResize) {
    return elementResize.element instanceof LaneNode && resize.handleMove.element.location === ResizeHandleLocation.Top;
  }

  private changeLaneResizeToMove(elementResize: TrackedElementResize) {
    elementResize.toBounds = { ...elementResize.fromBounds, ...Bounds.position(elementResize.toBounds) };
  }
}

export class IvyMoveElementKeyListener extends MoveElementKeyListener {
  override keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const direction = this.getDirection(event);
    if (!direction) {
      return [];
    }
    const elementIds = this.getMovableElementIds();
    if (elementIds.length === 0) {
      return [];
    }
    if (this.isInvalidLaneMove(direction)) {
      return [];
    }

    const snap = this.changeBoundsManager.usePositionSnap(event);
    const offsetX = snap ? this.grid.x : 1;
    const offsetY = snap ? this.grid.y : 1;

    // adapted: do not snap again if we already used snap to get the offset since our elements may not already be positioned on the grid but we still only want grid-sized movements
    // adapted: show quick actions UI
    switch (direction) {
      case Direction.Up:
        return [MoveElementRelativeAction.create({ elementIds, moveX: 0, moveY: -offsetY, snap: false }), QuickActionUI.show(elementIds)];
      case Direction.Down:
        return [MoveElementRelativeAction.create({ elementIds, moveX: 0, moveY: offsetY, snap: false }), QuickActionUI.show(elementIds)];
      case Direction.Right:
        return [MoveElementRelativeAction.create({ elementIds, moveX: offsetX, moveY: 0, snap: false }), QuickActionUI.show(elementIds)];
      case Direction.Left:
        return [MoveElementRelativeAction.create({ elementIds, moveX: -offsetX, moveY: 0, snap: false }), QuickActionUI.show(elementIds)];
    }
  }

  protected getDirection(event: KeyboardEvent): Direction | undefined {
    if (this.matchesMoveUpKeystroke(event)) {
      return Direction.Up;
    } else if (this.matchesMoveDownKeystroke(event)) {
      return Direction.Down;
    } else if (this.matchesMoveRightKeystroke(event)) {
      return Direction.Right;
    } else if (this.matchesMoveLeftKeystroke(event)) {
      return Direction.Left;
    }
    return undefined;
  }

  protected getMovableElementIds(): string[] {
    // Check for sizeable and only move top-level elements
    const selectedElements = this.selectionService
      .getSelectedElements()
      .filter(element => (isMoveable(element) && isSizeable(element)) || isLaneResizable(element));
    return selectedElements.filter(element => !this.isChildOfSelected(selectedElements, element)).map(element => element.id);
  }

  protected isInvalidLaneMove(direction: Direction) {
    const hasLanesInSelection = this.selectionService.getSelectedElements().find(element => isLaneResizable(element));
    return hasLanesInSelection !== undefined && (direction === Direction.Left || direction === Direction.Right);
  }

  protected isChildOfSelected(selectedElements: GModelElement[], element: GModelElement): boolean {
    return element instanceof GChildElement && selectedElements.includes(element.parent);
  }
}
