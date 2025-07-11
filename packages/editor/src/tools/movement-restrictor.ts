import { GChildElement, GModelElement, type IMovementRestrictor, isBoundsAware, isBoundsAwareMoveable, Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { isLaneResizable } from '../lanes/model';

@injectable()
export class IvyMovementRestrictor implements IMovementRestrictor {
  cssClasses = ['movement-not-allowed'];

  validate(element: GModelElement, newLocation?: Point): boolean {
    if (!newLocation) {
      return true;
    }
    if (!isBoundsAwareMoveable(element) && !isLaneResizable(element)) {
      return false;
    }
    const parentLocation = this.parentLocation(element, Point.ORIGIN);
    return parentLocation.x + newLocation.x >= 0 && parentLocation.y + newLocation.y >= 0;
  }

  private parentLocation(element: GModelElement, location: Point): Point {
    if (element instanceof GChildElement) {
      const parent = element.parent;
      if (isBoundsAware(parent)) {
        return this.parentLocation(parent, { x: location.x + parent.bounds.x, y: location.y + parent.bounds.y });
      }
    }
    return location;
  }
}
