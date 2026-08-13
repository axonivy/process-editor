import {
  angleOfPoint,
  EdgePadding,
  GEdgeView,
  type IView,
  Point,
  PolylineEdgeViewWithGapsOnIntersections,
  type RenderingContext,
  svg,
  toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { h, type VNode } from 'snabbdom';
import { Edge, MulitlineEditLabel } from './model';

import { ActivityTypes } from './view-types';

const JSX = { createElement: svg };

@injectable()
export class ForeignLabelView implements IView {
  render(model: MulitlineEditLabel, context: RenderingContext): VNode {
    const labelBounds = model.labelBounds;
    const lines = model.text.split(/\r?\n/u);
    const lineBreakContents = lines.flatMap((line, index) => {
      return index < lines.length - 1 ? [line, h('br')] : [line];
    });
    const foreignObjectContents = h(
      'div',
      {
        style: {
          height: `${labelBounds.height}px`
        }
      },
      lineBreakContents
    );
    return (
      <g>
        <foreignObject
          requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
          height={labelBounds.height}
          width={labelBounds.width}
          x={labelBounds.x}
          y={labelBounds.y}
          z={10}
          class-sprotty-label
          class-node-child-label={model.parent.type.startsWith(ActivityTypes.DEFAULT)}
        >
          {foreignObjectContents}
        </foreignObject>
        {context.renderChildren(model)}
      </g>
    );
  }
}

@injectable()
export class WorkflowEdgeView extends PolylineEdgeViewWithGapsOnIntersections {
  protected renderLine(edge: Edge, segments: Point[], context: RenderingContext): VNode {
    const line = super.renderLine(edge, segments, context, undefined);
    if (line.data) {
      line.data.style = { stroke: edge.color };
    }
    return line;
  }

  protected renderAdditionals(edge: Edge, segments: Point[], context: RenderingContext): VNode[] {
    const additionals = super.renderAdditionals(edge, segments, context);
    const edgePadding = this.edgePadding(edge);
    const edgePaddingNode = edgePadding ? [this.renderMouseHandle(segments, edgePadding)] : [];

    const p1 = segments[segments.length - 2];
    const p2 = segments[segments.length - 1];
    const arrow = (
      <path
        class-sprotty-edge={true}
        class-arrow={true}
        d='M 0.5,0 L 6,-3 L 6,3 Z'
        transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
        style={{ stroke: edge.color, fill: edge.color }}
      />
    );
    additionals.push(...edgePaddingNode, arrow);
    return additionals;
  }

  private edgePadding(edge: Edge): number | undefined {
    if (edge.args) {
      return EdgePadding.from(edge);
    }
    return undefined;
  }

  protected renderMouseHandle(segments: Point[], padding: number): VNode {
    return (
      <path
        class-mouse-handle
        d={this.createPathForSegments(segments)}
        style-stroke-width={padding * 2}
        style-stroke='transparent'
        style-stroke-dasharray='none'
        style-stroke-dashoffset='0'
      />
    );
  }

  protected createPathForSegments(segments: Point[]): string {
    const firstPoint = segments[0];
    let path = `M ${firstPoint.x},${firstPoint.y}`;
    for (let i = 1; i < segments.length; i++) {
      const p = segments[i];
      path += ` L ${p.x},${p.y}`;
    }
    return path;
  }
}

@injectable()
export class AssociationEdgeView extends GEdgeView {
  protected renderLine(edge: Edge, segments: Point[], context: RenderingContext): VNode {
    const line = super.renderLine(edge, segments, context);
    if (line.data) {
      line.data.style = { stroke: edge.color };
    }
    return line;
  }

  protected override renderAdditionals(edge: Edge, segments: Point[], _context: RenderingContext): VNode[] {
    // for additional padding we draw another transparent path with larger stroke width
    const edgePadding = this.edgePadding(edge);
    return edgePadding ? [this.renderMouseHandle(segments, edgePadding)] : [];
  }

  private edgePadding(edge: Edge): number | undefined {
    if (edge.args) {
      return EdgePadding.from(edge);
    }
    return undefined;
  }
}
