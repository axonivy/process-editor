import type {
  GGraph,
  GModelFactory,
  GNode,
  IVNodePostprocessor,
  ModelRenderer,
  ModelRendererFactory,
  ViewRegistry
} from '@eclipse-glsp/client';
import { DefaultTypes, TYPES, baseViewModule, configureView, routingModule } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import type { VNode } from 'snabbdom';
import toHTML from 'snabbdom-to-html';
import { beforeEach, describe, expect, test } from 'vitest';
import { createTestContainer } from '../utils/test-utils';
import { SBreakpointHandle } from './model';
import { SBreakpointHandleView } from './view';

function createContainer(): Container {
  const container = createTestContainer(baseViewModule, routingModule);
  configureView(container, SBreakpointHandle.TYPE, SBreakpointHandleView);
  return container;
}

function createModel(graphFactory: GModelFactory): GGraph {
  const node = {
    id: 'node',
    type: DefaultTypes.NODE,
    position: { x: 100, y: 100 },
    size: { width: 200, height: 50 },
    children: [
      { id: 'breakpoint', condition: 'true', type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-disabled', disabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition', condition: 'bla', type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-disabled', condition: 'bla', disabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-globaldisabled', globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-disabled-globaldisabled', disabled: true, globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-globaldisabled', condition: 'bla', globalDisabled: true, type: SBreakpointHandle.TYPE },
      {
        id: 'breakpoint-condition-disabled-globaldisabled',
        condition: 'bla',
        disabled: true,
        globalDisabled: true,
        type: SBreakpointHandle.TYPE
      }
    ]
  };
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: [node] }) as GGraph;
  return graph;
}

describe('BreakpointView', () => {
  let context: ModelRenderer;
  let graphFactory: GModelFactory;
  let viewRegistry: ViewRegistry;
  let graph: GGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    graphFactory = container.get<GModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
  });

  test('render breakpoint', () => {
    const view = renderBreakpoint('breakpoint');
    const expectation = '<g><circle class="ivy-breakpoint-handle" cx="-10" cy="9" r="4" /></g>';
    expect(toHTML(view)).to.be.equals(expectation);
  });

  test('render disabled breakpoint', () => {
    assertBreakpoint('breakpoint-disabled', 'disabled');
  });

  test('render condition breakpoint', () => {
    assertBreakpoint('breakpoint-condition', 'condition');
  });

  test('render condition disabled breakpoint', () => {
    assertBreakpoint('breakpoint-condition-disabled', 'disabled condition');
  });

  test('render (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-globaldisabled');
  });

  test('render disabled (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-disabled-globaldisabled', 'disabled');
  });

  test('render condition (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-condition-globaldisabled', 'condition');
  });

  test('render condition disabled (globalDisabled) breakpoint', () => {
    assertBreakpointGlobalDisable('breakpoint-condition-disabled-globaldisabled', 'disabled condition');
  });

  test('render full graph', () => {
    const view = context.renderElement(graph);
    const graphAndNode =
      '<svg id="sprotty_graph" class="sprotty-graph" tabindex="0"><g transform="scale(1) translate(0,0)">' +
      '<g id="sprotty_node" transform="translate(100, 100)"><rect class="sprotty-node" x="0" y="0" width="200" height="50" />';
    expect(toHTML(view))
      .to.contains(graphAndNode)
      .and.contains('<g id="sprotty_breakpoint">')
      .and.contains('<g id="sprotty_breakpoint-disabled">')
      .and.contains('<g id="sprotty_breakpoint-condition">')
      .and.contains('<g id="sprotty_breakpoint-condition-disabled">')
      .and.contains('<g id="sprotty_breakpoint-globaldisabled">')
      .and.contains('<g id="sprotty_breakpoint-disabled-globaldisabled">')
      .and.contains('<g id="sprotty_breakpoint-condition-globaldisabled">')
      .and.contains('<g id="sprotty_breakpoint-condition-disabled-globaldisabled">');
  });

  function renderBreakpoint(breakpointId: string): VNode | undefined {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    return view.render(graph.index.getById(breakpointId) as GNode, context);
  }

  function assertBreakpoint(breakpointId: string, expectedCssClass: string): void {
    const view = renderBreakpoint(breakpointId);
    const breakpoint = `class="ivy-breakpoint-handle ${expectedCssClass}"`;
    expect(toHTML(view)).to.contain(breakpoint);
  }

  function assertBreakpointGlobalDisable(breakpointId: string, expectedCssClass?: string): void {
    const view = renderBreakpoint(breakpointId);
    let breakpoint = 'class="ivy-breakpoint-handle';
    if (expectedCssClass) {
      breakpoint = `class="ivy-breakpoint-handle ${expectedCssClass}"`;
    }
    const line = '<line class="ivy-breakpoint-handle-globaldisable" x1="-15" y1="14" x2="-5" y2="4" />';
    expect(toHTML(view)).to.contain(breakpoint);
    expect(toHTML(view)).to.contain(line);
  }
});
