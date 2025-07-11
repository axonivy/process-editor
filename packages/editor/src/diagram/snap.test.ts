import { createFeatureSet, GModelElement, GridSnapper } from '@eclipse-glsp/client';
import { describe, expect, test } from 'vitest';
import { ActivityNode } from './model';

describe('IvyGridSnapper', () => {
  const snapper = new GridSnapper({ x: 8, y: 8 });

  test('element with no size should snap to grid', () => {
    const element = new GModelElement();
    expect(snapper.snap({ x: 0, y: 0 }, element)).to.deep.equals({ x: 0, y: 0 });
    expect(snapper.snap({ x: 8, y: 11 }, element)).to.deep.equals({ x: 8, y: 8 });
    expect(snapper.snap({ x: 15, y: 12 }, element)).to.deep.equals({ x: 16, y: 16 });
  });

  test('element with size should snap to grid', () => {
    const element = new ActivityNode();
    element.features = createFeatureSet(ActivityNode.DEFAULT_FEATURES);
    element.size = { width: 10, height: 10 };
    expect(snapper.snap({ x: 0, y: 0 }, element)).to.deep.equals({ x: 0, y: 0 });
    expect(snapper.snap({ x: 10, y: 10 }, element)).to.deep.equals({ x: 8, y: 8 });
    expect(snapper.snap({ x: 55, y: 40 }, element)).to.deep.equals({ x: 56, y: 40 });
  });
});
