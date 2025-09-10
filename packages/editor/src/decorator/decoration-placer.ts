import { type Decoration, DecorationPlacer, GChildElement, GModelElement, isSizeable, Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { ActivityNode } from '../diagram/model';

@injectable()
export class IvyDecorationPlacer extends DecorationPlacer {
  protected static readonly DECORATOR_RADIUS: number = 6;

  override getPosition(element: GModelElement & Decoration): Point {
    if (element instanceof GChildElement && isSizeable(element.parent)) {
      const xPos = -IvyDecorationPlacer.DECORATOR_RADIUS * 2;
      const yPos = element.parent.bounds.height - IvyDecorationPlacer.DECORATOR_RADIUS * 2;
      if (element.parent instanceof ActivityNode) {
        return {
          x: xPos - 6,
          y: yPos - 4
        };
      }
      return {
        x: xPos - 4,
        y: yPos
      };
    }
    return Point.ORIGIN;
  }
}
