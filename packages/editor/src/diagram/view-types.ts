export namespace EventTypes {
  export const DEFAULT = 'event';
}

export namespace EventStartTypes {
  export const DEFAULT = EventTypes.DEFAULT + ':start';
  export const START = DEFAULT + ':requestStart';
  export const START_ERROR = DEFAULT + ':errorStartEvent';
  export const START_SIGNAL = DEFAULT + ':signalStartEvent';
  export const START_PROGRAM = DEFAULT + ':programStart';
  export const START_SUB = DEFAULT + ':callSubStart';
  export const START_WS = DEFAULT + ':webserviceStart';
  export const START_HD = DEFAULT + ':htmlDialogStart';
  export const START_HD_METHOD = DEFAULT + ':htmlDialogMethodStart';
  export const START_HD_EVENT = DEFAULT + ':htmlDialogEventStart';
  export const START_EMBEDDED = DEFAULT + ':embeddedStart';
}

export namespace EventEndTypes {
  export const DEFAULT = EventTypes.DEFAULT + ':end';
  export const END = DEFAULT + ':taskEnd';
  export const END_ERROR = DEFAULT + ':errorEnd';
  export const END_PAGE = DEFAULT + ':taskEndPage';
  export const END_SUB = DEFAULT + ':callSubEnd';
  export const END_WS = DEFAULT + ':webserviceEnd';
  export const END_HD = DEFAULT + ':htmlDialogEnd';
  export const END_HD_EXIT = DEFAULT + ':htmlDialogExit';
  export const END_EMBEDDED = DEFAULT + ':embeddedEnd';
}

export namespace EventIntermediateTypes {
  export const DEFAULT = EventTypes.DEFAULT + ':intermediate';
  export const INTERMEDIATE_TASK = DEFAULT + ':taskSwitchEvent';
  export const INTERMEDIATE_WAIT = DEFAULT + ':waitEvent';
}

export namespace EventBoundaryTypes {
  export const DEFAULT = EventTypes.DEFAULT + ':boundary';
  export const BOUNDARY_ERROR = DEFAULT + ':errorBoundaryEvent';
  export const BOUNDARY_SIGNAL = DEFAULT + ':signalBoundaryEvent';
}

export namespace GatewayTypes {
  export const DEFAULT = 'gateway';
  export const TASK = DEFAULT + ':taskSwitchGateway';
  export const JOIN = DEFAULT + ':join';
  export const SPLIT = DEFAULT + ':split';
  export const ALTERNATIVE = DEFAULT + ':alternative';
}

export namespace ActivityTypes {
  export const DEFAULT = 'activity';
  export const GENERIC = DEFAULT + ':genericActivity';
  export const COMMENT = DEFAULT + ':processAnnotation';
  export const SCRIPT = DEFAULT + ':script';
  export const HD = DEFAULT + ':dialogCall';
  export const USER = DEFAULT + ':userTask';
  export const SOAP = DEFAULT + ':webServiceCall';
  export const REST = DEFAULT + ':restClientCall';
  export const DB = DEFAULT + ':database';
  export const EMAIL = DEFAULT + ':eMail';
  export const SUB_PROCESS = DEFAULT + ':subProcessCall';
  export const EMBEDDED_PROCESS = DEFAULT + ':embeddedProcessElement';
  export const TRIGGER = DEFAULT + ':triggerCall';
  export const PROGRAM = DEFAULT + ':programInterface';
  export const BPMN_GENERIC = DEFAULT + ':genericBpmnElement';
  export const BPMN_USER = DEFAULT + ':userBpmnElement';
  export const BPMN_MANUAL = DEFAULT + ':manualBpmnElement';
  export const BPMN_SCRIPT = DEFAULT + ':scriptBpmnElement';
  export const BPMN_RECEIVE = DEFAULT + ':receiveBpmnElement';
  export const BPMN_RULE = DEFAULT + ':ruleBpmnElement';
  export const BPMN_SEND = DEFAULT + ':sendBpmnElement';
  export const BPMN_SERVICE = DEFAULT + ':serviceBpmnElement';
  export const LABEL = DEFAULT + '-label';
}

export namespace LaneTypes {
  export const DEFAULT = 'lanes';
  export const LANE = DEFAULT + ':lane';
  export const POOL = DEFAULT + ':pool';
  export const LABEL = DEFAULT + ':label';
}

export namespace EdgeTypes {
  export const DEFAULT = 'edge';
  export const ASSOCIATION = DEFAULT + ':association';
  export const LABEL = DEFAULT + ':label';
}

export namespace LabelType {
  export const DEFAULT = 'label';
}
