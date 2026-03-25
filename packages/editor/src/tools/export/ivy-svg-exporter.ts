import { Bounds, GEdge, GLSPSvgExporter, GModelRoot, GNode, getAbsoluteBounds, type GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { MulitlineEditLabel, RotateLabel } from '../../diagram/model';
import { getAbsoluteEdgeBounds, getAbsoluteLabelBounds } from '../../utils/diagram-utils';

@injectable()
export class IvySvgExporter extends GLSPSvgExporter {
  override getBounds(root: GModelRoot): Bounds {
    return this.getSvgBounds(root);
  }

  public getSvgBounds(root: GModelRoot, selectedElements?: Array<GModelElement>): Bounds {
    const allBounds: Bounds[] = [];
    root.index
      .all()
      .filter(element => element.root !== element)
      .filter(element => !(element instanceof RotateLabel))
      .filter(element => !selectedElements || selectedElements.length === 0 || selectedElements.includes(element))
      .forEach(element => {
        if (element instanceof GNode) {
          allBounds.push(getAbsoluteBounds(element));
        }
        if (element instanceof MulitlineEditLabel && element.text.length > 0) {
          allBounds.push(getAbsoluteLabelBounds(element));
        }
        if (element instanceof GEdge) {
          allBounds.push(getAbsoluteEdgeBounds(element));
        }
      });
    const bounds = allBounds.filter(Bounds.isValid).reduce(Bounds.combine);
    return { ...bounds, x: bounds.x - 5, y: bounds.y - 5, width: bounds.width + 10, height: bounds.height + 10 };
  }

  protected override copyStyle(source: Element, target: Element, skippedProperties: string[]): void {
    try {
      super.copyStyle(source, target, skippedProperties);
    } catch {
      console.debug('Ignore elements with not styles');
    }
  }
}
