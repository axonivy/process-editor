/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, test, expect } from 'vitest';
import type { VNode, VNodeData } from 'snabbdom';
import type { Bounds } from '@eclipse-glsp/client';

import { getActivityIconDecorator, getIconDecorator } from './views';
import { GatewayTypes, EventStartTypes, ActivityTypes } from '../view-types';
import { SvgIcons } from './icons';
import type { ActivityNode } from '../model';

describe('Event and Gateway Icons', () => {
  test('no icon', () => {
    let node = getIconDecorator('', 15, '');
    assertNoIcon(node);
    node = getIconDecorator('std:NoDecorator', 15, 'red');
    assertNoIcon(node);
  });

  test('icon', () => {
    let node = getIconDecorator(GatewayTypes.ALTERNATIVE, 25, '');
    assertIcon(node!, { height: 14, width: 18, x: 16, y: 18 }, SvgIcons.ALTERNATIVE, '');
    node = getIconDecorator(EventStartTypes.START_ERROR, 25, 'red');
    assertIcon(node!, { height: 14, width: 18, x: 16, y: 18 }, SvgIcons.ERROR_EVENT, 'red');
  });

  test('img icon', () => {
    let node = getIconDecorator('/faces/javax.faces.resource/url', 30, '');
    assertImgIcon(node!, { height: 14, width: 18, x: 21, y: 23 }, '/faces/javax.faces.resource/url');
    node = getIconDecorator('/faces/javax.faces.resource/url', 30, 'red');
    assertImgIcon(node!, { height: 14, width: 18, x: 21, y: 23 }, '/faces/javax.faces.resource/url');
  });
});

describe('Activity Icons', () => {
  test('no icon', () => {
    const activity = { bounds: { height: 60, width: 120, x: 0, y: 0 } } as ActivityNode;
    assertNoIcon(getActivityIconDecorator(activity, ''));
    assertNoIcon(getActivityIconDecorator(activity, 'std:NoDecorator'));
  });

  test('icon', () => {
    const activity = { type: ActivityTypes.SCRIPT, bounds: { height: 60, width: 120, x: 0, y: 0 } } as ActivityNode;
    let node = getActivityIconDecorator(activity, ActivityTypes.SCRIPT);
    assertActivityIcon(node!, { height: 20, width: 20, x: 10, y: 60 / 2 - 10 }, SvgIcons.SCRIPT);
    node = getActivityIconDecorator(activity, ActivityTypes.SCRIPT);
    assertActivityIcon(node!, { height: 20, width: 20, x: 10, y: 60 / 2 - 10 }, SvgIcons.SCRIPT);
  });

  test('img icon', () => {
    const activity = { type: ActivityTypes.SCRIPT, bounds: { height: 60, width: 120, x: 0, y: 0 } } as ActivityNode;
    let node = getActivityIconDecorator(activity, '/faces/javax.faces.resource/url');
    assertActivityImgIcon(node!, { height: 20, width: 20, x: 10, y: 60 / 2 - 10 }, '/faces/javax.faces.resource/url');
    node = getActivityIconDecorator(activity, '/faces/javax.faces.resource/url');
    assertActivityImgIcon(node!, { height: 20, width: 20, x: 10, y: 60 / 2 - 10 }, '/faces/javax.faces.resource/url');
  });
});

function assertNoIcon(node?: VNode): void {
  expect(node).toBeUndefined();
}

function assertActivityIcon(node: VNode, expectedBounds: Bounds, expectedPath: string): void {
  expect(node.sel).toEqual('g');
  expect(node.children).toHaveLength(2);
  assertBounds((node.children![0] as VNode).data!, { height: 30, width: 30, x: 5, y: 60 / 2 - 15 });
  const svg = node.children![1] as VNode;
  assertBounds(svg.data!, expectedBounds, '0 0 20 20');

  const path = svg.children![0] as VNode;
  expect(path.sel).toEqual('path');
  expect(path.data!.attrs!.d).toEqual(expectedPath);
}

function assertIcon(node: VNode, expectedBounds: Bounds, expectedPath: string, color?: string): void {
  expect(node.sel).toEqual('svg');
  expect(node.children).not.toHaveLength(0);
  assertBounds(node.data!, expectedBounds, '0 0 20 20');

  const path = node.children![0] as VNode;
  expect(path.sel).toEqual('path');
  expect(path.data!.attrs!.d).toEqual(expectedPath);

  if (color) {
    expect(path.data!.style!.fill).toEqual(color);
  }
}

function assertActivityImgIcon(node: VNode, expectedBounds: Bounds, exprectedUrl: string): void {
  expect(node.sel).toEqual('g');
  expect(node.children).toHaveLength(2);
  assertBounds((node.children![0] as VNode).data!, { height: 30, width: 30, x: 5, y: 60 / 2 - 15 });

  const foreignObject = node.children![1] as VNode;
  expect(foreignObject.sel).toEqual('foreignObject');
  assertBounds(foreignObject.data!, expectedBounds);

  const icon = foreignObject.children![0] as VNode;
  expect(icon.sel).toEqual('img');
  expect(icon.data!.attrs!.src).toEqual(exprectedUrl);
}

function assertImgIcon(node: VNode, expectedBounds: Bounds, exprectedUrl: string): void {
  expect(node.sel).toEqual('foreignObject');
  assertBounds(node.data!, expectedBounds);

  const icon = node.children![0] as VNode;
  expect(icon.sel).toEqual('img');
  expect(icon.data!.attrs!.src).toEqual(exprectedUrl);
}

function assertBounds(data: VNodeData, expectedBounds: Bounds, viewBox?: string): void {
  expect(data.attrs!.height).toEqual(expectedBounds.height);
  expect(data.attrs!.width).toEqual(expectedBounds.width);
  expect(data.attrs!.x).toEqual(expectedBounds.x);
  expect(data.attrs!.y).toEqual(expectedBounds.y);
  if (viewBox) {
    expect(data.attrs!.viewBox).toEqual(viewBox);
  }
}
