import { ModelRenderer, SGraph, SModelFactory, SNode, ViewRegistry } from '@eclipse-glsp/client';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

import { EventStartTypes, EventEndTypes, EventIntermediateTypes, EventBoundaryTypes } from '../view-types';
import { EventNode } from '../model';

import toHTML from 'snabbdom-to-html';
import { setupGlobal, setupViewTestContainer } from '../../test-utils/test-helper';

function createModel(graphFactory: SModelFactory): SGraph {
  const children: any[] = [];
  const eventNodeSize = { width: 30, height: 30 };
  children.push({ id: 'start', type: EventStartTypes.START, position: { x: 100, y: 100 }, size: eventNodeSize });
  children.push({ id: 'startError', type: EventStartTypes.START_ERROR, position: { x: 100, y: 150 }, size: eventNodeSize });
  children.push({ id: 'startSignal', type: EventStartTypes.START_SIGNAL, position: { x: 100, y: 200 }, size: eventNodeSize });
  children.push({ id: 'startProgram', type: EventStartTypes.START_PROGRAM, position: { x: 100, y: 250 }, size: eventNodeSize });
  children.push({ id: 'startSub', type: EventStartTypes.START_SUB, position: { x: 100, y: 30 }, size: eventNodeSize });
  children.push({ id: 'startWs', type: EventStartTypes.START_WS, position: { x: 100, y: 350 }, size: eventNodeSize });
  children.push({ id: 'startHd', type: EventStartTypes.START_HD, position: { x: 100, y: 400 }, size: eventNodeSize });
  children.push({ id: 'startHdMethod', type: EventStartTypes.START_HD_METHOD, position: { x: 100, y: 450 }, size: eventNodeSize });
  children.push({ id: 'startHdEvent', type: EventStartTypes.START_HD_EVENT, position: { x: 100, y: 500 }, size: eventNodeSize });
  children.push({ id: 'end', type: EventEndTypes.END, position: { x: 200, y: 100 }, size: eventNodeSize });
  children.push({ id: 'endError', type: EventEndTypes.END_ERROR, position: { x: 200, y: 150 }, size: eventNodeSize });
  children.push({ id: 'endPage', type: EventEndTypes.END_PAGE, position: { x: 200, y: 200 }, size: eventNodeSize });
  children.push({ id: 'endSub', type: EventEndTypes.END_SUB, position: { x: 200, y: 250 }, size: eventNodeSize });
  children.push({ id: 'endWs', type: EventEndTypes.END_WS, position: { x: 200, y: 300 }, size: eventNodeSize });
  children.push({ id: 'endHd', type: EventEndTypes.END_HD, position: { x: 200, y: 350 }, size: eventNodeSize });
  children.push({ id: 'endHdExit', type: EventEndTypes.END_HD_EXIT, position: { x: 200, y: 400 }, size: eventNodeSize });
  children.push({
    id: 'intermediateTask',
    type: EventIntermediateTypes.INTERMEDIATE_TASK,
    position: { x: 300, y: 150 },
    size: eventNodeSize
  });
  children.push({
    id: 'intermediateWait',
    type: EventIntermediateTypes.INTERMEDIATE_WAIT,
    position: { x: 300, y: 200 },
    size: eventNodeSize
  });
  children.push({ id: 'boundaryError', type: EventBoundaryTypes.BOUNDARY_ERROR, position: { x: 400, y: 100 }, size: eventNodeSize });
  children.push({ id: 'boundarySignal', type: EventBoundaryTypes.BOUNDARY_SIGNAL, position: { x: 400, y: 150 }, size: eventNodeSize });
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as SGraph;
  return graph;
}

describe('EventNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let graph: SGraph;
  let viewRegistry: ViewRegistry;

  beforeAll(() => {
    setupGlobal();
  });

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  it('render full event graph', () => {
    const graphVNode = context.renderElement(graph);
    expect(toHTML(graphVNode)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    const unknownVNode = context.renderElement(unknown);
    expect(toHTML(unknownVNode)).to.be.equal('<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0">?unknown?</text>');
  });

  it('render start event node', () => {
    assertEvent(EventStartTypes.START, 'start', {});
  });

  it('render start error event node', () => {
    assertEvent(EventStartTypes.START_ERROR, 'startError', { icon: true });
  });

  it('render start signal event node', () => {
    assertEvent(EventStartTypes.START_SIGNAL, 'startSignal', { icon: true });
  });

  it('render start program event node', () => {
    assertEvent(EventStartTypes.START_PROGRAM, 'startProgram', { icon: true });
  });

  it('render start sub event node', () => {
    assertEvent(EventStartTypes.START_SUB, 'startSub', {});
  });

  it('render start ws event node', () => {
    assertEvent(EventStartTypes.START_WS, 'startWs', {});
  });

  it('render start hd event node', () => {
    assertEvent(EventStartTypes.START_HD, 'startHd', {});
  });

  it('render start hd method event node', () => {
    assertEvent(EventStartTypes.START_HD_METHOD, 'startHdMethod', {});
  });

  it('render start hd event event node', () => {
    assertEvent(EventStartTypes.START_HD_EVENT, 'startHdEvent', {});
  });

  it('render end event node', () => {
    assertEvent(EventEndTypes.END, 'end', {});
  });

  it('render end error event node', () => {
    assertEvent(EventEndTypes.END_ERROR, 'endError', {});
  });

  it('render end page event node', () => {
    assertEvent(EventEndTypes.END_PAGE, 'endPage', {});
  });

  it('render end sub event node', () => {
    assertEvent(EventEndTypes.END_SUB, 'endSub', {});
  });

  it('render end ws event node', () => {
    assertEvent(EventEndTypes.END_WS, 'endWs', {});
  });

  it('render end hd event node', () => {
    assertEvent(EventEndTypes.END_HD, 'endHd', {});
  });

  it('render end hd exit event node', () => {
    assertEvent(EventEndTypes.END_HD_EXIT, 'endHdExit', {});
  });

  it('render intermediate task event node', () => {
    assertEvent(EventIntermediateTypes.INTERMEDIATE_TASK, 'intermediateTask', { intermediate: true });
  });

  it('render intermediate wait event node', () => {
    assertEvent(EventIntermediateTypes.INTERMEDIATE_WAIT, 'intermediateWait', { intermediate: true });
  });

  it('render boundary error event node', () => {
    assertEvent(EventBoundaryTypes.BOUNDARY_ERROR, 'boundaryError', { intermediate: true });
  });

  it('render boundary signal event node', () => {
    assertEvent(EventBoundaryTypes.BOUNDARY_SIGNAL, 'boundarySignal', { intermediate: true });
  });

  it('render with execution badge', () => {
    const view = viewRegistry.get(EventStartTypes.START);
    const start = graph.index.getById('start') as EventNode;
    start.executionCount = 3;
    const vnode = view.render(start, context);
    const executionBadge =
      '<g><rect class="execution-badge" rx="7" ry="7" x="19" y="-7" width="22" height="14" /><text class="execution-text" x="30" dy=".4em">3</text></g>';
    expect(toHTML(vnode)).to.contains(executionBadge);
  });

  it('render with color', () => {
    const view = viewRegistry.get(EventBoundaryTypes.BOUNDARY_SIGNAL);
    const signal = graph.index.getById('boundarySignal') as EventNode;
    signal.args = { color: 'red' };
    const vnode = view.render(signal, context);
    const colorCircle = /<circle.*style="stroke: red".*\/>/;
    const newLocal = toHTML(vnode);
    expect(newLocal).to.matches(colorCircle);
  });

  function assertEvent(type: string, nodeId: string, options: { intermediate?: boolean; icon?: boolean }): void {
    const view = viewRegistry.get(type);
    const vnode = view.render(graph.index.getById(nodeId) as SNode, context);
    const node = toHTML(vnode);
    expect(node).to.contains('<circle class="sprotty-node" r="15" cx="15" cy="15" style="stroke: " />');
    if (options.intermediate) {
      expect(node).to.contains('<circle class="sprotty-node sprotty-task-node" r="12" cx="15" cy="15" />');
    }
    if (options.icon) {
      expect(node).to.contains('<svg class="sprotty-icon-svg" viewBox="0 0 20 20" height="14" width="18" x="6" y="8"');
    }
  }
});
