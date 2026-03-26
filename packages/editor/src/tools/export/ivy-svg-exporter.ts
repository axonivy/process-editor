import {
  Bounds,
  GChildElement,
  GEdge,
  GLSPSvgExporter,
  GModelRoot,
  GNode,
  getAbsoluteBounds,
  type GModelElement
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { MulitlineEditLabel, RotateLabel } from '../../diagram/model';
import { getAbsoluteEdgeBounds, getAbsoluteLabelBounds } from '../../utils/diagram-utils';

@injectable()
export class IvySvgExporter extends GLSPSvgExporter {
  private exportedSelection?: Array<GModelElement>;

  override getBounds(root: GModelRoot): Bounds {
    return this.getSvgBounds(root, this.exportedSelection);
  }

  public exportSelectionSvg(root: GModelRoot, selectedElements: Array<GModelElement>): string | undefined {
    if (selectedElements.length === 0) {
      return undefined;
    }
    const svgElement = this.findVisibleSvgElement();
    if (!svgElement) {
      return undefined;
    }
    const sourceSelection = this.createSelectionSvgElement(svgElement, selectedElements);
    if (!sourceSelection) {
      return undefined;
    }
    return this.createSelectionExport(sourceSelection, root, selectedElements);
  }

  public getSvgBounds(root: GModelRoot, selectedElements?: Array<GModelElement>): Bounds {
    const selectedElementIds = new Set(selectedElements?.map(element => element.id) ?? []);
    const allBounds: Bounds[] = [];
    root.index
      .all()
      .filter(element => element.root !== element)
      .filter(element => !(element instanceof RotateLabel))
      .filter(
        element => !selectedElements || selectedElements.length === 0 || this.isSelectedOrContainedInSelection(element, selectedElementIds)
      )
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

  private createSelectionSvgElement(svgElement: SVGSVGElement, selectedElements: Array<GModelElement>): SVGSVGElement | undefined {
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    const selectedDomIds = new Set(selectedElements.map(element => this.createUniqueDOMElementId(element.id)));
    const keptElements = new Set<Element>([svgClone]);
    let hasSelectedElements = false;

    selectedDomIds.forEach(domId => {
      const selectedDomElement = svgClone.querySelector(`#${CSS.escape(domId)}`);
      if (!selectedDomElement) {
        return;
      }
      hasSelectedElements = true;
      let current: Element | null = selectedDomElement;
      while (current) {
        keptElements.add(current);
        current = current.parentElement;
      }
    });

    if (!hasSelectedElements) {
      return undefined;
    }

    this.pruneSvgClone(svgClone, keptElements, selectedDomIds);
    return svgClone;
  }

  private pruneSvgClone(parent: Element, keptElements: Set<Element>, selectedDomIds: Set<string>): void {
    Array.from(parent.children).forEach(child => {
      if (child.tagName.toLowerCase() === 'defs') {
        return;
      }
      if (selectedDomIds.has(child.id)) {
        return;
      }
      if (keptElements.has(child)) {
        this.pruneSvgClone(child, keptElements, selectedDomIds);
        return;
      }
      child.remove();
    });
  }

  private createSelectionExport(sourceSelection: SVGSVGElement, root: GModelRoot, selectedElements: Array<GModelElement>): string {
    const sourceContainer = document.createElement('div');
    sourceContainer.style.position = 'fixed';
    sourceContainer.style.left = '-10000px';
    sourceContainer.style.top = '-10000px';
    sourceContainer.style.width = '0';
    sourceContainer.style.height = '0';
    sourceContainer.style.overflow = 'hidden';
    sourceContainer.style.pointerEvents = 'none';
    sourceContainer.appendChild(sourceSelection);
    document.body.appendChild(sourceContainer);

    try {
      this.exportedSelection = selectedElements;
      return this.createSvg(sourceSelection, root);
    } finally {
      this.exportedSelection = undefined;
      document.body.removeChild(sourceContainer);
    }
  }

  private createUniqueDOMElementId(elementId: string): string {
    return this.options.baseDiv ? `${this.options.baseDiv}_${elementId}` : elementId;
  }

  private findVisibleSvgElement(): SVGSVGElement | undefined {
    const div = document.getElementById(this.options.baseDiv);
    return div?.querySelector('svg') ?? undefined;
  }

  private isSelectedOrContainedInSelection(element: GModelElement, selectedElementIds: Set<string>): boolean {
    let current: GModelElement = element;
    while (true) {
      if (selectedElementIds.has(current.id)) {
        return true;
      }
      if (!(current instanceof GChildElement)) {
        return false;
      }
      current = current.parent;
    }
  }
}
