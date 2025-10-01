import type { CustomFeatures } from '@eclipse-glsp/client';
import {
  ConsoleLogger,
  DefaultTypes,
  DeleteElementContextMenuItemProvider,
  FeatureModule,
  GGraph,
  GIssueMarker,
  LogLevel,
  TYPES,
  configureModelElement,
  moveFeature,
  openFeature,
  overrideModelElement,
  selectFeature
} from '@eclipse-glsp/client';
import { breakpointFeature } from '../breakpoint/model';
import { jumpFeature } from '../jump/model';
import { goToFormFeature } from '../open-form/model';
import { goToSourceFeature } from '../open-source/model';
import { IvyMovementRestrictor } from '../tools/movement-restrictor';
import { multipleOutgoingEdgesFeature } from '../ui-tools/quick-action/edge/model';
import { singleWrapFeature, unwrapFeature } from '../wrap/model';
import { ActivityNodeView, SubActivityNodeView } from './activities/activity-views';
import { errorBoundaryFeature, signalBoundaryFeature } from './boundary/model';
import './diagram.css';
import { EventNodeView, IntermediateEventNodeView } from './events/event-views';
import { GatewayNodeView } from './gateways/gateway-views';
import { IvyGraphView } from './grid/ivy-graph-view';
import { LaneNodeView, PoolNodeView, RotateLabelView } from './lanes/lane-views';
import { IvyIssueMarkerView } from './marker/issue-marker-view';
import './marker/marker.css';
import {
  ActivityLabel,
  ActivityNode,
  CommentNode,
  Edge,
  EdgeLabel,
  EndEventNode,
  EventNode,
  GatewayNode,
  LaneNode,
  MulitlineEditLabel,
  RotateLabel,
  StartEventNode
} from './model';
import {
  ActivityTypes,
  EdgeTypes,
  EventBoundaryTypes,
  EventEndTypes,
  EventIntermediateTypes,
  EventStartTypes,
  GatewayTypes,
  LabelType,
  LaneTypes
} from './view-types';
import { AssociationEdgeView, ForeignLabelView, WorkflowEdgeView } from './views';

const ivyDiagramModule = new FeatureModule((bind, unbind, isBound, rebind) => {
  rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);
  bind(TYPES.IMovementRestrictor).to(IvyMovementRestrictor);

  const context = { bind, unbind, isBound, rebind };
  overrideModelElement(context, DefaultTypes.GRAPH, GGraph, IvyGraphView, { enable: [openFeature] });
  overrideModelElement(context, DefaultTypes.ISSUE_MARKER, GIssueMarker, IvyIssueMarkerView);

  configureStartEvent(EventStartTypes.START);
  configureStartEvent(EventStartTypes.START_ERROR);
  configureStartEvent(EventStartTypes.START_SIGNAL);
  configureStartEvent(EventStartTypes.START_PROGRAM, { enable: [goToSourceFeature] });
  configureStartEvent(EventStartTypes.START_SUB);
  configureStartEvent(EventStartTypes.START_WS);
  configureStartEvent(EventStartTypes.START_HD);
  configureStartEvent(EventStartTypes.START_HD_METHOD);
  configureStartEvent(EventStartTypes.START_HD_EVENT);
  configureStartEvent(EventStartTypes.START_EMBEDDED);
  configureStartEvent(EventStartTypes.START_THIRD_PARTY);

  configureEndEvent(EventEndTypes.END);
  configureEndEvent(EventEndTypes.END_ERROR);
  configureEndEvent(EventEndTypes.END_PAGE);
  configureEndEvent(EventEndTypes.END_SUB);
  configureEndEvent(EventEndTypes.END_WS);
  configureEndEvent(EventEndTypes.END_HD);
  configureEndEvent(EventEndTypes.END_HD_EXIT);
  configureEndEvent(EventEndTypes.END_EMBEDDED);

  configureModelElement(context, EventIntermediateTypes.INTERMEDIATE_TASK, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventIntermediateTypes.INTERMEDIATE_WAIT, EventNode, IntermediateEventNodeView, {
    enable: [goToSourceFeature]
  });
  configureModelElement(context, EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY, EventNode, IntermediateEventNodeView);

  configureModelElement(context, EventBoundaryTypes.BOUNDARY_ERROR, StartEventNode, IntermediateEventNodeView);
  configureModelElement(context, EventBoundaryTypes.BOUNDARY_SIGNAL, StartEventNode, IntermediateEventNodeView);

  configureGateway(GatewayTypes.TASK);
  configureGateway(GatewayTypes.JOIN, { disable: [multipleOutgoingEdgesFeature] });
  configureGateway(GatewayTypes.SPLIT);
  configureGateway(GatewayTypes.ALTERNATIVE);

  configureModelElement(context, ActivityTypes.LABEL, ActivityLabel, ForeignLabelView);
  configureModelElement(context, ActivityTypes.COMMENT, CommentNode, ActivityNodeView, {
    disable: [breakpointFeature, errorBoundaryFeature, singleWrapFeature]
  });
  configureActivity(ActivityTypes.GENERIC);
  configureActivity(ActivityTypes.SCRIPT);
  configureActivity(ActivityTypes.SOAP);
  configureActivity(ActivityTypes.REST);
  configureActivity(ActivityTypes.DB);
  configureActivity(ActivityTypes.EMAIL);
  configureActivity(ActivityTypes.THIRD_PARTY);
  configureActivity(ActivityTypes.THIRD_PARTY_RULE);
  configureActivity(ActivityTypes.PROGRAM, { enable: [goToSourceFeature] });
  configureActivity(ActivityTypes.TRIGGER, { enable: [jumpFeature] });
  configureActivity(ActivityTypes.HD, { enable: [goToFormFeature] });
  configureActivity(ActivityTypes.USER, {
    enable: [signalBoundaryFeature, goToFormFeature]
  });
  configureEmbedded(ActivityTypes.SUB_PROCESS, { enable: [jumpFeature], disable: [singleWrapFeature] });
  configureEmbedded(ActivityTypes.EMBEDDED_PROCESS);
  configureEmbedded(ActivityTypes.BPMN_GENERIC);
  configureEmbedded(ActivityTypes.BPMN_MANUAL);
  configureEmbedded(ActivityTypes.BPMN_RECEIVE);
  configureEmbedded(ActivityTypes.BPMN_RULE);
  configureEmbedded(ActivityTypes.BPMN_SCRIPT);
  configureEmbedded(ActivityTypes.BPMN_SEND);
  configureEmbedded(ActivityTypes.BPMN_SERVICE);
  configureEmbedded(ActivityTypes.BPMN_USER);

  configureModelElement(context, LaneTypes.LANE, LaneNode, LaneNodeView);
  configureModelElement(context, LaneTypes.POOL, LaneNode, PoolNodeView);
  configureModelElement(context, LaneTypes.LABEL, RotateLabel, RotateLabelView);

  overrideModelElement(context, EdgeTypes.DEFAULT, Edge, WorkflowEdgeView);
  configureModelElement(context, EdgeTypes.ASSOCIATION, Edge, AssociationEdgeView);
  configureModelElement(context, EdgeTypes.LABEL, EdgeLabel, ForeignLabelView, { enable: [selectFeature, moveFeature] });

  overrideModelElement(context, LabelType.DEFAULT, MulitlineEditLabel, ForeignLabelView, { enable: [selectFeature, moveFeature] });

  function configureStartEvent(type: string, features?: CustomFeatures): void {
    configureModelElement(context, type, StartEventNode, EventNodeView, features);
  }

  function configureEndEvent(type: string, features?: CustomFeatures): void {
    configureModelElement(context, type, EndEventNode, EventNodeView, features);
  }

  function configureGateway(type: string, features?: CustomFeatures): void {
    configureModelElement(context, type, GatewayNode, GatewayNodeView, features);
  }

  function configureActivity(type: string, features?: CustomFeatures): void {
    configureModelElement(context, type, ActivityNode, ActivityNodeView, features);
  }

  function configureEmbedded(type: string, features?: CustomFeatures): void {
    configureModelElement(
      context,
      type,
      ActivityNode,
      SubActivityNodeView,
      features ? features : { enable: [jumpFeature, unwrapFeature, multipleOutgoingEdgesFeature], disable: [singleWrapFeature] }
    );
  }
});

export default ivyDiagramModule;
