import {
  Action,
  GLSPMouseTool,
  GLSPScrollMouseListener,
  GModelElement,
  GResizeHandle,
  findParentByFeature,
  isCtrlOrCmd,
  isViewport,
  toTypeGuard
} from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from 'inversify';

import { QuickActionUI } from '../quick-action/quick-action-ui';

@injectable()
export class IvyScrollMouseListener extends GLSPScrollMouseListener {
  @inject(QuickActionUI) quickActionUi!: QuickActionUI;
  @inject(GLSPMouseTool) mouseTool!: GLSPMouseTool;

  @postConstruct()
  protected init(): void {
    this.mouseTool.registerListener(this);
  }

  override mouseDown(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    const handle = findParentByFeature(target, toTypeGuard(GResizeHandle));
    if (handle) {
      return [];
    }
    return super.mouseDown(target, event);
  }

  override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    const actions = super.mouseMove(target, event);
    if (this.lastScrollPosition) {
      this.quickActionUi.hideUi();
    }
    return actions;
  }

  override mouseUp(target: GModelElement, event: MouseEvent): Action[] {
    if (this.lastScrollPosition) {
      this.quickActionUi.showUi();
    }
    return super.mouseUp(target, event);
  }

  override wheel(target: GModelElement, event: WheelEvent): (Action | Promise<Action>)[] {
    if (isCtrlOrCmd(event)) {
      return [];
    }
    const viewport = findParentByFeature(target, isViewport);
    const scrollPos = { x: event.pageX, y: event.pageY };
    if (event.shiftKey) {
      scrollPos.x += event.deltaY !== 0 ? event.deltaY : event.deltaX;
    } else {
      scrollPos.x += event.deltaX;
      scrollPos.y += event.deltaY;
    }
    if (viewport) {
      return this.dragCanvas(viewport, event, scrollPos);
    }
    return [];
  }
}
