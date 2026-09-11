import type { Data } from './inscription';
import type { ConfigData } from './inscription-data';

export type GeneralData = Omit<Data, 'config'>;

export type ProcessCallData = Pick<ConfigData, 'processCall'>;

export type DialogCallData = Pick<ConfigData, 'dialog'>;

export type CallData = Pick<ConfigData, 'call'>;

export type EndPageData = Pick<ConfigData, 'page'>;

export type OutputData = Pick<ConfigData, 'output' | 'sudo'>;

export type ConditionData = Pick<ConfigData, 'conditions'>;

export type TaskData = Pick<ConfigData, 'persistOnStart' | 'task' | 'tasks'>;

export type CaseData = Pick<ConfigData, 'case'>;

export type StartData = Pick<ConfigData, 'input' | 'signature'>;

export type ResultData = Pick<ConfigData, 'result'>;

export type ErrorCatchData = Pick<ConfigData, 'errorCode'>;

export type SignalCatchData = Pick<ConfigData, 'signalCode' | 'attachToBusinessCase'>;

export type MailData = Pick<ConfigData, 'headers' | 'failIfMissingAttachments' | 'attachments' | 'message' | 'exceptionHandler'>;

export type TriggerData = Pick<ConfigData, 'triggerable' | 'case' | 'task'>;

export type RequestData = Pick<ConfigData, 'request' | 'permission'>;

export type ErrorThrowData = Pick<ConfigData, 'throws' | 'code'>;

export type QueryData = Pick<ConfigData, 'query'>;

export type DbErrorData = Pick<ConfigData, 'exceptionHandler'>;

export type CacheData = Pick<ConfigData, 'cache'>;

export type WebserviceStartData = Pick<ConfigData, 'permission' | 'exception'>;

export type WsRequestData = Pick<ConfigData, 'clientId' | 'operation' | 'properties'>;

export type WsErrorData = Pick<ConfigData, 'exceptionHandler'>;

export type ProcessDataData = Pick<ConfigData, 'data'>;

export type PermissionsData = Pick<ConfigData, 'permissions'>;

export type WebServiceProcessData = Pick<ConfigData, 'wsAuth' | 'wsTypeName'>;

export type ProgramStartData = Pick<ConfigData, 'javaClass' | 'permission'>;

export type RestResponseData = Pick<ConfigData, 'response'>;

export type RestRequestData = Pick<ConfigData, 'method' | 'target' | 'body' | 'code'>;

export type ProgramInterfaceStartData = Pick<ConfigData, 'javaClass' | 'exceptionHandler' | 'timeout'>;

export type EventData = Pick<ConfigData, 'javaClass' | 'eventId' | 'timeout'>;

export type ConfigurationData = Pick<ConfigData, 'userConfig' | 'javaClass'>;

export type RuleData = Pick<ConfigData, 'rule'>;
