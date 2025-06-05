import { Bounds, GEdge, GLSPSvgExporter, GModelRoot, GNode, getAbsoluteBounds } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { MulitlineEditLabel, RotateLabel } from '../../diagram/model';
import { getAbsoluteEdgeBounds, getAbsoluteLabelBounds } from '../../utils/diagram-utils';

@injectable()
export class IvySvgExporter extends GLSPSvgExporter {
  public plainExport(root: GModelRoot) {
    if (typeof document !== 'undefined') {
      let svgElement = this.findSvgElement();
      if (svgElement) {
        svgElement = this.prepareSvgElement(svgElement, root);
        const serializedSvg = this.createSvg(svgElement, root);
        const svgExport = this.getSvgExport(serializedSvg, svgElement, root);
        // do not give request/response id here as otherwise the action is treated as an unrequested response
        return svgExport;
      }
    }
    return undefined;
  }

  protected getBounds(root: GModelRoot): Bounds {
    const allBounds: Bounds[] = [];
    root.index
      .all()
      .filter(element => element.root !== element)
      .filter(element => !(element instanceof RotateLabel))
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
    return allBounds.filter(Bounds.isValid).reduce(Bounds.combine);
  }
}
