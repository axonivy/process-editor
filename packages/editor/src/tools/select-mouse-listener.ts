import { GLSPMouseTool, GModelElement, RankedSelectMouseListener, type Action } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export class IvyMouseTool extends GLSPMouseTool {}

@injectable()
export class IvySelectMouseListener extends RankedSelectMouseListener {
  mouseUp(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    if (!this.isMouseDown) {
      // only handle mouse up if mouse down was also within the diagram
      return [];
    }
    return super.mouseUp(target, event);
  }
}
