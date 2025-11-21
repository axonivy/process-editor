import { IvyIcons } from '@axonivy/ui-icons';
import { StandardIcons } from '../../diagram/icon/icons';
import {
  ActivityTypes,
  EventBoundaryTypes,
  EventEndTypes,
  EventIntermediateTypes,
  EventStartTypes,
  GatewayTypes,
  LaneTypes
} from '../../diagram/view-types';

export enum IconStyle {
  SI,
  SVG,
  IMG,
  NO
}

export interface NodeIcon {
  res: string;
  style: IconStyle;
}
export const NoIcon = { res: '', style: IconStyle.NO };

export const MenuIcons = new Map<string, IvyIcons>([
  // Start Events
  [EventStartTypes.START, IvyIcons.Start],
  [EventStartTypes.START_SIGNAL, IvyIcons.StartSignalOutline],
  [EventStartTypes.START_PROGRAM, IvyIcons.StartProgramOutline],
  [EventStartTypes.START_ERROR, IvyIcons.ErrorStart],
  [EventStartTypes.START_SUB, IvyIcons.SubStartOutline],
  [EventStartTypes.START_WS, IvyIcons.WsStartOutline],
  [EventStartTypes.START_HD, IvyIcons.InitStartOutline],
  [EventStartTypes.START_HD_METHOD, IvyIcons.MethodStartOutline],
  [EventStartTypes.START_HD_EVENT, IvyIcons.EventStartOutline],
  [EventStartTypes.START_THIRD_PARTY, IvyIcons.Extension],
  // Intermediate Events
  [EventIntermediateTypes.INTERMEDIATE_TASK, IvyIcons.TaskDoubleOutline],
  [EventIntermediateTypes.INTERMEDIATE_WAIT, IvyIcons.ClockOutline],
  [EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY, IvyIcons.Extension],
  // Boundary Events
  [EventBoundaryTypes.BOUNDARY_ERROR, IvyIcons.ErrorStart],
  [EventBoundaryTypes.BOUNDARY_SIGNAL, IvyIcons.StartSignalOutline],
  // End Events
  [EventEndTypes.END, IvyIcons.ProcessEnd],
  [EventEndTypes.END_PAGE, IvyIcons.EndPageOutline],
  [EventEndTypes.END_ERROR, IvyIcons.ErrorEnd],
  [EventEndTypes.END_SUB, IvyIcons.SubEndOutline],
  [EventEndTypes.END_WS, IvyIcons.WsStartOutline],
  [EventEndTypes.END_HD, IvyIcons.ProcessEnd],
  [EventEndTypes.END_HD_EXIT, IvyIcons.ExitEndOutline],
  // Gateways
  [GatewayTypes.ALTERNATIVE, IvyIcons.AlternativeGateways],
  [GatewayTypes.SPLIT, IvyIcons.JoinGateways],
  [GatewayTypes.JOIN, IvyIcons.JoinGateways],
  [GatewayTypes.TASK, IvyIcons.JoinTasksGateways],
  // Workflow Activities
  [ActivityTypes.USER, IvyIcons.UserTaskOutline],
  [ActivityTypes.HD, IvyIcons.UserDialogOutline],
  [ActivityTypes.SCRIPT, IvyIcons.ScriptFileOutline],
  [ActivityTypes.EMBEDDED_PROCESS, IvyIcons.SubActivitiesDashed],
  [ActivityTypes.SUB_PROCESS, IvyIcons.SubActivities],
  [ActivityTypes.TRIGGER, IvyIcons.TriggerOutline],
  // Interface Activities
  [ActivityTypes.DB, IvyIcons.DatabaseOutline],
  [ActivityTypes.SOAP, IvyIcons.WebService],
  [ActivityTypes.REST, IvyIcons.RestClientOutline],
  [ActivityTypes.EMAIL, IvyIcons.EMailOutline],
  [ActivityTypes.THIRD_PARTY, IvyIcons.Extension],
  [ActivityTypes.THIRD_PARTY_RULE, IvyIcons.RuleOutline],
  [ActivityTypes.PROGRAM, IvyIcons.ProgramOutline],
  // BPMN Activities
  [ActivityTypes.BPMN_GENERIC, IvyIcons.SubActivitiesDashed],
  [ActivityTypes.BPMN_USER, IvyIcons.SubUserOutline],
  [ActivityTypes.BPMN_MANUAL, IvyIcons.SubManualOutline],
  [ActivityTypes.BPMN_SCRIPT, IvyIcons.SubScriptOutline],
  [ActivityTypes.BPMN_SERVICE, IvyIcons.SubWebService],
  [ActivityTypes.BPMN_RULE, IvyIcons.SubRuleOutline],
  [ActivityTypes.BPMN_SEND, IvyIcons.SubSendOutline],
  [ActivityTypes.BPMN_RECEIVE, IvyIcons.SubReceiveOutline],
  // Artifacts
  [ActivityTypes.COMMENT, IvyIcons.NoteOutline],
  [LaneTypes.POOL, IvyIcons.PoolSwimlanes],
  [LaneTypes.LANE, IvyIcons.LaneSwimlanes]
]);

export const resolveIcon = (iconUri: string): NodeIcon => {
  if (iconUri.includes('/faces/javax.faces.resource')) {
    return { res: iconUri, style: IconStyle.IMG };
  }
  const elementIcon = MenuIcons.get(iconUri);
  if (elementIcon) {
    return { res: elementIcon, style: IconStyle.SI };
  }
  const standardIcon = StandardIcons.get(iconUri);
  if (standardIcon) {
    return { res: standardIcon, style: IconStyle.SVG };
  }
  return NoIcon;
};
