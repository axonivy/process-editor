import { svg, Bounds } from '@eclipse-glsp/client';
import { type VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';

import { IconStyle, resolveIcon } from './icons';

const JSX = { createElement: svg };

export function getActivityIconDecorator(iconUri: string, color: string): VNode {
  const bounds = { height: 14, width: 14, x: 4, y: 3 };
  return iconDecorator(iconUri, bounds, false, color);
}

export function getIconDecorator(iconUri: string, radius: number, color: string): VNode {
  const bounds = { height: 14, width: 18, x: radius - 9, y: radius - 7 };
  return iconDecorator(iconUri, bounds, true, color);
}

function iconDecorator(iconUri: string, bounds: Bounds, smallIcon: boolean, color: string): VNode {
  const icon = resolveIcon(iconUri);
  if (icon.style === IconStyle.SI) {
    return (
      <svg
        class-sprotty-icon-svg
        viewBox='0 0 20 20'
        height={bounds.height}
        width={bounds.width}
        style={{ height: `${bounds.height}px`, width: `${bounds.width}px` }}
        x={bounds.x}
        y={bounds.y}
      >
        <path style={{ fill: color }} d={icon.res} />
      </svg>
    );
  }
  if (icon.style === IconStyle.IMG) {
    const foreignObjectContents = virtualize(`<img src="${icon.res}"></img>`);
    return (
      <g>
        <foreignObject
          requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
          height={bounds.height}
          width={bounds.width}
          style={{ height: `${bounds.height}px`, width: `${bounds.width}px` }}
          x={bounds.x}
          y={bounds.y}
          class-sprotty-icon
          class-icon-small={smallIcon}
        >
          {foreignObjectContents}
        </foreignObject>
      </g>
    );
  }
  return <g></g>;
}
