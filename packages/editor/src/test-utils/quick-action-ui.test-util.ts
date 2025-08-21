import {
  Bounds,
  DefaultTypes,
  Dimension,
  GGraph,
  GGraphView,
  GNode,
  TYPES,
  configureModelElement,
  createFeatureSet,
  type CustomFeatures,
  type GLabel,
  type GModelFactory,
  type GModelRoot,
  type Point
} from '@eclipse-glsp/client';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { type Container } from 'inversify';
import ivyConnectorModule from '../connector/di.config';
import { ActivityNode, Edge, EndEventNode, EventNode, GatewayNode, LaneNode, MulitlineEditLabel } from '../diagram/model';
import { ActivityTypes, EdgeTypes, EventEndTypes, EventStartTypes, GatewayTypes, LaneTypes } from '../diagram/view-types';
import { ivyLabelEditModule } from '../edit-label/di.config';
import ivyJumpModule from '../jump/di.config';
import { jumpFeature } from '../jump/model';
import ivyLaneModule from '../lanes/di.config';
import type { IvyViewerOptions } from '../options';
import { configureIvyViewerOptions } from '../options';
import ivyQuickActionModule from '../ui-tools/quick-action/di.config';
import { quickActionFeature } from '../ui-tools/quick-action/model';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import ivyToolBarModule from '../ui-tools/tool-bar/di.config';
import { createTestDiagramContainer } from '../utils/test-utils';
import ivyWrapModule from '../wrap/di.config';

export function createContainer(options?: Partial<IvyViewerOptions>): Container {
  setupSprottyDiv();
  const container = createTestDiagramContainer(
    ivyQuickActionModule,
    ivyJumpModule,
    ivyLaneModule,
    ivyConnectorModule,
    { replace: ivyToolBarModule },
    { replace: ivyLabelEditModule },
    ivyWrapModule
  );
  configureModelElement(container, DefaultTypes.GRAPH, GGraph, GGraphView);
  configureIvyViewerOptions(container, options ?? {});
  return container;
}

export function createRoot(container: Container): GGraph {
  const graphFactory = container.get<GModelFactory>(TYPES.IModelFactory);
  const root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as GGraph;
  root.add(createDefaultNode('foo', ActivityTypes.HD, { x: 100, y: 100, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES));
  root.add(
    createDefaultNode('sub', ActivityTypes.EMBEDDED_PROCESS, { x: 300, y: 100, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES, {
      enable: [jumpFeature]
    })
  );
  root.add(
    createDefaultNode('alternative', GatewayTypes.ALTERNATIVE, { x: 100, y: 200, width: 32, height: 32 }, GatewayNode.DEFAULT_FEATURES)
  );
  root.add(
    createDefaultNode(
      'alternativeWithConnection',
      GatewayTypes.ALTERNATIVE,
      { x: 100, y: 200, width: 32, height: 32 },
      GatewayNode.DEFAULT_FEATURES
    )
  );
  root.add(createDefaultNode('start', EventStartTypes.START, { x: 200, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES));
  root.add(
    createDefaultNode('startWithConnection', EventStartTypes.START, { x: 200, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES)
  );
  root.add(createNode(new EndEventNode(), 'end', EventEndTypes.END, { x: 300, y: 200, width: 30, height: 30 }, EventNode.DEFAULT_FEATURES));
  root.add(
    createDefaultNode('noQuickActions', ActivityTypes.HD, { x: 500, y: 500, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES, {
      disable: [quickActionFeature]
    })
  );
  root.add(createDefaultNode('comment', ActivityTypes.COMMENT, { x: 600, y: 500, width: 200, height: 50 }, ActivityNode.DEFAULT_FEATURES));
  const edge = createEdge('edge', EdgeTypes.DEFAULT, 'startWithConnection', 'end', Edge.DEFAULT_FEATURES);
  const edge2 = createEdge('edge2', EdgeTypes.DEFAULT, 'alternativeWithConnection', 'end', Edge.DEFAULT_FEATURES);
  root.add(edge);
  root.add(edge2);
  edge.add(createEdgeLabel());
  root.add(createNode(new LaneNode(), 'pool', LaneTypes.POOL, { x: 0, y: 0, width: 500, height: 100 }, LaneNode.DEFAULT_FEATURES));
  root.add(createNode(new LaneNode(), 'lane', LaneTypes.LANE, { x: 0, y: 100, width: 500, height: 100 }, LaneNode.DEFAULT_FEATURES));
  return root;
}

function createDefaultNode(id: string, type: string, bounds: Bounds, defaultFeatures: symbol[], customFeatues?: CustomFeatures): GNode {
  const node = new GNode();
  return createNode(node, id, type, bounds, defaultFeatures, customFeatues);
}

function createNode(
  node: GNode,
  id: string,
  type: string,
  bounds: Bounds,
  defaultFeatures: symbol[],
  customFeatues?: CustomFeatures
): GNode {
  node.id = id;
  node.type = type;
  node.bounds = bounds;
  node.features = createFeatureSet(defaultFeatures, customFeatues);
  return node;
}

function createEdge(
  id: string,
  type: string,
  sourceId: string,
  targetId: string,
  defaultFeatures: symbol[],
  customFeatues?: CustomFeatures
): Edge {
  const edge = new Edge();
  edge.id = id;
  edge.type = type;
  edge.sourceId = sourceId;
  edge.targetId = targetId;
  edge.features = createFeatureSet(defaultFeatures, customFeatues);
  return edge;
}

function createEdgeLabel(): GLabel {
  const label = new MulitlineEditLabel();
  label.text = '';
  label.type = EdgeTypes.LABEL;
  label.features = createFeatureSet(MulitlineEditLabel.DEFAULT_FEATURES);
  return label;
}

export function setupSprottyDiv(): void {
  const baseDiv = document.createElement('div') as HTMLElement;
  baseDiv.id = 'sprotty';
  document.body.appendChild(baseDiv);
}

export function getQuickActionDiv(): HTMLElement {
  return document.querySelector('.quick-action-ui') as HTMLElement;
}

export function assertMultiQuickActionUi(childCount: number, dimension?: Dimension, position?: Point): void {
  assertQuickActionUi(childCount, position);
  const selectionBorder = document.querySelector('.quick-action-selection-box') as HTMLElement;
  expect(selectionBorder.tagName).to.be.equals('DIV');
  if (dimension) {
    expect(selectionBorder.style.height).to.be.equals(`${dimension.height}px`);
    expect(selectionBorder.style.width).to.be.equals(`${dimension.width}px`);
  }
}

export function assertQuickActionUi(childCount: number, position?: Partial<Point>): void {
  const uiDiv = getQuickActionDiv();
  const children = uiDiv?.querySelectorAll('.ui-button') ?? [];
  expect(children.length).to.be.equals(childCount);
  if (position) {
    if (position.y) {
      expect(uiDiv.style.top).to.be.equals(`${position.y}px`);
    }
    if (position.x) {
      expect(uiDiv.style.left).to.be.equals(`${position.x}px`);
    }
  }
}

export function assertQuickAction(childIndex: number, title: string, icon?: string): void {
  const uiDiv = getQuickActionDiv();
  const quickAction = uiDiv.querySelectorAll('.quick-actions-group > button')[childIndex] as HTMLElement;
  expect(quickAction.tagName).to.be.equals('BUTTON');
  expect(quickAction.title).to.be.equals(title);
  if (icon) {
    const iconElement = quickAction.children[0];
    expect(iconElement.className).to.contains(`ivy ivy-${icon}`);
  }
}

export async function renderQuickActionUi(ui: QuickActionUI, root: Readonly<GModelRoot>, ...contextElementIds: string[]): Promise<void> {
  ui.show(root, ...contextElementIds);
  const result = await render(ui['render'](root, ...contextElementIds));
  await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
  result.unmount();
}
