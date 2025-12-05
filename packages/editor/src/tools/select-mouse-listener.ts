import { GLSPMouseTool, GModelElement, RankedSelectMouseListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export class IvyMouseTool extends GLSPMouseTool {}

@injectable()
export class IvySelectMouseListener extends RankedSelectMouseListener {
  override mouseUp(target: GModelElement, event: MouseEvent) {
    if (!this.isMouseDown) {
      // only handle mouse up if mouse down was also within the diagram
      return [];
    }
    return super.mouseUp(target, event);
  }
}
