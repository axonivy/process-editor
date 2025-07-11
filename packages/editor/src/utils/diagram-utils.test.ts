import { GEdge, GModelRoot, GNode } from '@eclipse-glsp/client';
import { beforeEach, describe, expect, test } from 'vitest';
import { getAbsoluteEdgeBounds } from './diagram-utils';

describe('DiagramUtils - absoluteEdgeBounds', () => {
  const edge = new GEdge();

  beforeEach(() => {
    const root = new GModelRoot();
    const source = new GNode();
    source.bounds = { x: 10, y: 10, width: 20, height: 10 };
    const target = new GNode();
    target.bounds = { x: 50, y: 10, width: 20, height: 10 };
    root.add(edge);
    root.add(source);
    root.add(target);
    edge.sourceId = source.id;
    edge.targetId = target.id;
  });

  test('no waypoint', () => {
    const absoluteBounds = getAbsoluteEdgeBounds(edge);
    expect(absoluteBounds).to.be.deep.equals({ x: 20, y: 15, width: 40, height: 0 });
  });

  test('one waypoint', () => {
    edge.routingPoints = [{ x: 70, y: 30 }];
    const absoluteBounds = getAbsoluteEdgeBounds(edge);
    expect(absoluteBounds).to.be.deep.equals({ x: 20, y: 15, width: 50, height: 15 });
  });

  test('many waypoint', () => {
    edge.routingPoints = [
      { x: 70, y: 30 },
      { x: 110, y: 0 }
    ];
    const absoluteBounds = getAbsoluteEdgeBounds(edge);
    expect(absoluteBounds).to.be.deep.equals({ x: 20, y: 0, width: 90, height: 30 });
  });
});
