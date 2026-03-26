import { Bounds, type GModelRoot } from '@eclipse-glsp/client';
import { SModelRootImpl } from 'sprotty';
import { describe, expect, it } from 'vitest';
import { ActivityNode, MulitlineEditLabel } from '../../diagram/model';
import { getAbsoluteLabelBounds } from '../../utils/diagram-utils';
import { IvySvgExporter } from './ivy-svg-exporter';

describe('IvySvgExporter', () => {
  it('includes descendant label bounds for selected nodes', () => {
    const root = new SModelRootImpl() as GModelRoot;
    root.id = 'root';
    root.type = 'graph';

    const node = new ActivityNode();
    node.id = 'node';
    node.type = 'activity';
    node.position = { x: 100, y: 50 };
    node.size = { width: 40, height: 40 };

    const label = new MulitlineEditLabel();
    label.id = 'label';
    label.type = 'label';
    label.text = 'descendant label';
    label.position = { x: 120, y: 10 };
    label.bounds = { x: 0, y: 0, width: 120, height: 20 };

    root.add(node);
    node.add(label);

    const exporter = new IvySvgExporter();
    const bounds = exporter.getSvgBounds(root, [node]);

    const nodeBounds = node.bounds;
    const labelBounds = getAbsoluteLabelBounds(label);
    const combined = Bounds.combine(nodeBounds, labelBounds);

    expect(bounds.x).toBe(combined.x - 5);
    expect(bounds.y).toBe(combined.y - 5);
    expect(bounds.width).toBe(combined.width + 10);
    expect(bounds.height).toBe(combined.height + 10);
  });
});
