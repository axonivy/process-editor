import type { GGraph, GModelFactory, GNode, ModelRenderer, ViewRegistry } from '@eclipse-glsp/client';
import toHTML from 'snabbdom-to-html';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupViewTestContainer } from '../../test-utils/view-container.test-util';
import type { GatewayNode } from '../model';
import { GatewayTypes } from '../view-types';

function createModel(graphFactory: GModelFactory): GGraph {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];
  const gatewayNodeSize = { width: 32, height: 32 };
  children.push({ id: 'gatewayTask', type: GatewayTypes.TASK, position: { x: 500, y: 150 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayAlternative', type: GatewayTypes.ALTERNATIVE, position: { x: 500, y: 200 }, size: gatewayNodeSize });
  children.push({ id: 'gatewayJoin', type: GatewayTypes.JOIN, position: { x: 500, y: 250 }, size: gatewayNodeSize });
  children.push({ id: 'gatewaySplit', type: GatewayTypes.SPLIT, position: { x: 500, y: 300 }, size: gatewayNodeSize });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as GGraph;
}

describe('GatewayNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: GModelFactory;
  let graph: GGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  test('render full gateway graph', () => {
    let view = context.renderElement(graph);
    expect(toHTML(view)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    view = context.renderElement(unknown);
    expect(toHTML(view)).to.be.equal(
      '<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0" data-svg-metadata-api="true" data-svg-metadata-type="unknown">missing &quot;unknown&quot; view</text>'
    );
  });

  test('render task', () => {
    assertGateway(GatewayTypes.TASK, 'gatewayTask');
  });

  test('render alternative', () => {
    assertGateway(GatewayTypes.ALTERNATIVE, 'gatewayAlternative');
  });

  test('render join', () => {
    assertGateway(GatewayTypes.JOIN, 'gatewayJoin');
  });

  test('render split', () => {
    assertGateway(GatewayTypes.SPLIT, 'gatewaySplit');
  });

  test('render with execution badge', () => {
    const task = graph.index.getById('gatewayTask') as GatewayNode;
    task.executionCount = 3;
    const view = viewRegistry.get(GatewayTypes.TASK).render(task, context);
    const executionBadge =
      '<g><rect class="execution-badge" rx="7" ry="7" x="21" y="-7" width="22" height="14" /><text class="execution-text" x="32" dy=".4em">3</text></g>';
    expect(toHTML(view)).to.contains(executionBadge);
  });

  test('render with color', () => {
    const task = graph.index.getById('gatewayTask') as GatewayNode;
    task.args = { color: 'red' };
    const view = viewRegistry.get(GatewayTypes.TASK).render(task, context);
    const colorPolygon = /<polygon.*style="stroke: red".*\/>/;
    expect(toHTML(view)).to.matches(colorPolygon);
  });

  function assertGateway(type: string, nodeId: string): void {
    const view = viewRegistry.get(type).render(graph.index.getById(nodeId) as GNode, context);
    const node = toHTML(view);
    expect(node).to.contains('<polygon class="sprotty-node" points="16,0 32,16 16,32 0,16" style="stroke: " />');
    expect(node).to.contains('<svg class="sprotty-icon sprotty-icon-svg" viewBox="0 0 20 20" height="18" width="18" x="7" y="7"');
  }
});
