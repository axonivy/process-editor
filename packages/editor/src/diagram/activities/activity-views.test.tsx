import type { GGraph, GModelFactory, GNode, ModelRenderer, ViewRegistry } from '@eclipse-glsp/client';
import toHTML from 'snabbdom-to-html';
import type { VNode } from 'snabbdom-to-html-common';
import { beforeEach, describe, expect, test } from 'vitest';
import { setupViewTestContainer } from '../../test-utils/view-container.test-util';
import { standardIcons } from '../icon/icons';
import type { ActivityNode } from '../model';
import { ActivityTypes, LabelType } from '../view-types';

function createModel(graphFactory: GModelFactory): GGraph {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];
  const taskNodeSize = { width: 150, height: 50 };
  children.push({
    id: 'comment',
    type: ActivityTypes.COMMENT,
    position: { x: 600, y: 100 },
    size: taskNodeSize,
    children: [{ id: 'commentLabel', type: LabelType.DEFAULT, text: 'comment', position: { x: 0, y: 0 }, size: { width: 100, height: 30 } }]
  });
  children.push({ id: 'script', type: ActivityTypes.SCRIPT, position: { x: 600, y: 150 }, size: taskNodeSize });
  children.push({ id: 'hd', type: ActivityTypes.HD, position: { x: 600, y: 200 }, size: taskNodeSize });
  children.push({ id: 'user', type: ActivityTypes.USER, position: { x: 600, y: 250 }, size: taskNodeSize });
  children.push({ id: 'soap', type: ActivityTypes.SOAP, position: { x: 600, y: 300 }, size: taskNodeSize });
  children.push({ id: 'rest', type: ActivityTypes.REST, position: { x: 600, y: 350 }, size: taskNodeSize });
  children.push({ id: 'db', type: ActivityTypes.DB, position: { x: 600, y: 400 }, size: taskNodeSize });
  children.push({ id: 'email', type: ActivityTypes.EMAIL, position: { x: 600, y: 450 }, size: taskNodeSize });
  children.push({ id: 'subProcess', type: ActivityTypes.SUB_PROCESS, position: { x: 600, y: 500 }, size: taskNodeSize });
  children.push({ id: 'embeddedProcess', type: ActivityTypes.EMBEDDED_PROCESS, position: { x: 600, y: 550 }, size: taskNodeSize });
  children.push({ id: 'trigger', type: ActivityTypes.TRIGGER, position: { x: 600, y: 650 }, size: taskNodeSize });
  children.push({ id: 'program', type: ActivityTypes.PROGRAM, position: { x: 600, y: 700 }, size: taskNodeSize });
  children.push({ id: 'thirdParty', type: ActivityTypes.THIRD_PARTY, position: { x: 600, y: 750 }, size: taskNodeSize });
  children.push({ id: 'thirdPartyRule', type: ActivityTypes.THIRD_PARTY_RULE, position: { x: 600, y: 800 }, size: taskNodeSize });
  children.push({ id: 'webPage', type: ActivityTypes.GENERIC, position: { x: 600, y: 600 }, size: taskNodeSize });
  return graphFactory.createRoot({ id: 'graph', type: 'graph', children: children }) as GGraph;
}

describe('ActivityNodeView', () => {
  let context: ModelRenderer;
  let graphFactory: GModelFactory;
  let graph: GGraph;
  let viewRegistry: ViewRegistry;

  beforeEach(() => {
    [context, graphFactory, graph, viewRegistry] = setupViewTestContainer(createModel);
  });

  test('render full activity graph', () => {
    let view = context.renderElement(graph);
    expect(toHTML(view)).to.not.include('sprotty_unknown').and.not.include('sprotty-missing');
    const unknown = graphFactory.createRoot({ type: 'unknown', id: 'unknown', children: [] });
    view = context.renderElement(unknown);
    expect(toHTML(view)).to.be.equal(
      '<text id="sprotty_unknown" class="sprotty-missing" x="0" y="0" data-svg-metadata-api="true" data-svg-metadata-type="unknown">missing &quot;unknown&quot; view</text>'
    );
  });

  test('render comment node', () => {
    assertNode(ActivityTypes.COMMENT, 'comment', { label: true });
  });

  test('render script node', () => {
    assertNode(ActivityTypes.SCRIPT, 'script', { icon: standardIcons['std:Script'] });
  });

  test('render hd node', () => {
    assertNode(ActivityTypes.HD, 'hd', { icon: standardIcons['std:UserDialog'] });
  });

  test('render user node', () => {
    assertNode(ActivityTypes.USER, 'user', { icon: standardIcons['std:UserTask'] });
  });

  test('render soap node', () => {
    assertNode(ActivityTypes.SOAP, 'soap', { icon: standardIcons['std:WebService'] });
  });

  test('render rest node', () => {
    assertNode(ActivityTypes.REST, 'rest', { icon: standardIcons['std:RestClient'] });
  });

  test('render db node', () => {
    assertNode(ActivityTypes.DB, 'db', { icon: standardIcons['std:Database'] });
  });

  test('render email node', () => {
    assertNode(ActivityTypes.EMAIL, 'email', { icon: standardIcons['std:Mail'] });
  });

  test('render sub process node', () => {
    assertNode(ActivityTypes.SUB_PROCESS, 'subProcess', { decorator: true });
  });

  test('render embedded process node', () => {
    assertNode(ActivityTypes.EMBEDDED_PROCESS, 'embeddedProcess', { decorator: true });
  });

  test('render trigger node', () => {
    assertNode(ActivityTypes.TRIGGER, 'trigger', { icon: standardIcons['std:Trigger'] });
  });

  test('render program node', () => {
    assertNode(ActivityTypes.PROGRAM, 'program', { icon: standardIcons['std:Program'] });
  });

  test('render third party node', () => {
    assertNode(ActivityTypes.THIRD_PARTY, 'thirdParty', { icon: standardIcons['other:Puzzle'] });
  });

  test('render third party rule node', () => {
    assertNode(ActivityTypes.THIRD_PARTY_RULE, 'thirdPartyRule', { icon: standardIcons['std:Rule'] });
  });

  test('render unknown node', () => {
    assertNode(ActivityTypes.GENERIC, 'webPage', {});
  });

  test('render with execution badge', () => {
    const script = graph.index.getById('script') as ActivityNode;
    script.executionCount = 3;
    const view = viewRegistry.get(ActivityTypes.SCRIPT).render(script, context);
    const executionBadge =
      '<g><rect class="execution-badge" rx="7" ry="7" x="139" y="-7" width="22" height="14" /><text class="execution-text" x="150" dy=".4em">3</text></g>';
    expect(toHTML(view)).to.contains(executionBadge);
  });

  test('render with color', () => {
    const script = graph.index.getById('script') as ActivityNode;
    script.args = { color: 'red' };
    const view = viewRegistry.get(ActivityTypes.SCRIPT).render(script, context);
    const colorRect = /<rect.*style="stroke: red".*\/>/;
    expect(toHTML(view)).to.matches(colorRect);
  });

  function renderNode(type: string, nodeId: string): VNode | undefined {
    const view = viewRegistry.get(type);
    return view.render(graph.index.getById(nodeId) as GNode, context);
  }

  function assertNode(type: string, nodeId: string, options: { label?: boolean; icon?: string; decorator?: boolean }): void {
    const node = toHTML(renderNode(type, nodeId));
    expect(node).to.contain('class="sprotty-node');
    if (options.label) {
      expect(node).to.contain('class="sprotty-label node-child-label"');
    } else {
      expect(node).to.not.contain('class="sprotty-label node-child-label"');
    }
    if (options.icon) {
      expect(node).to.contain('class="sprotty-icon sprotty-icon-svg"');
      expect(node).to.contain(options.icon);
    } else {
      expect(node).to.not.contain('class="sprotty-icon-svg"');
    }
    if (options.decorator) {
      const decorator =
        '<svg x="69" y="37" height="12" width="12"><rect class="sprotty-node sprotty-task-node" x="1" y="1" rx="2" ry="2" width="10" height="10" />' +
        '<line class="sprotty-node-decorator" x1="6" y1="3" x2="6" y2="9" />' +
        '<line class="sprotty-node-decorator" x1="3" y1="6" x2="9" y2="6" /></svg>';
      expect(node).to.contain(decorator);
    } else {
      expect(node).to.not.contain('sprotty-node-decorator');
    }
  }
});
