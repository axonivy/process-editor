import { GLSPMouseTool, GModelElement, RankedSelectMouseListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import type { Action } from 'sprotty-protocol/lib/actions';

export class IvyMouseTool extends GLSPMouseTool {}

@injectable()
export class IvySelectMouseListener extends RankedSelectMouseListener {
  override mouseUp(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    if (!this.isMouseDown) {
      // only handle mouse up if mouse down was also within the diagram
      return [];
    }
    return super.mouseUp(target, event);
  }
}
