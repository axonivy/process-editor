import type { Brand, UnionToIntersection, ValuesAsUnionDeep } from '../utils/type-helper';
import type {
  Cache,
  CacheArtifact,
  Data,
  DbQuery,
  DbSqlStatement,
  ElementProgramInterface,
  ElementWaitEvent,
  ErrorDefinition,
  InscriptionElementContext,
  InscriptionRequest,
  InscriptionSaveRequest,
  InscriptionType,
  JavaEventTimeout,
  JavaTimeout,
  MailHeaders,
  ProcessConfig,
  RestBody,
  RestPayloadMapping,
  RestResponse,
  RestTarget,
  SchemaKey,
  SoapOperation,
  SoapWsProcessException,
  StartPermission,
  WebserviceProcessConfig,
  WfTask,
  WorkflowType
} from './inscription';
import type { GeneralData } from './part-data';

export type ConfigData = UnionToIntersection<Data['config']>;

export type ElementData = GeneralData & { config: ConfigData };

export type InscriptionData = Omit<InscriptionRequest, 'data' | 'defaults'> & {
  data: ElementData;
  defaults: ConfigData;
};

export type InscriptionSaveData = Omit<InscriptionSaveRequest, 'data'> & { data: ElementData };

export type ElementType = InscriptionType['id'];

export type SchemaKeys =
  | ValuesAsUnionDeep<SchemaKey>
  | keyof WfTask
  | keyof WfTask['expiry']
  | keyof WfTask['notification']
  | keyof MailHeaders
  | keyof StartPermission
  | keyof ErrorDefinition
  | keyof DbQuery
  | keyof DbSqlStatement
  | keyof Cache
  | keyof CacheArtifact
  | keyof SoapWsProcessException
  | keyof SoapOperation
  | keyof ProcessConfig
  | keyof WebserviceProcessConfig
  | keyof RestResponse
  | keyof RestPayloadMapping
  | keyof RestTarget
  | keyof RestBody
  | keyof JavaTimeout
  | keyof ElementProgramInterface
  | keyof ElementWaitEvent
  | keyof JavaEventTimeout;
export type SchemaPath = Brand<string, 'SchemaPath'>;

export interface InscriptionActionArgs {
  actionId:
    | 'newHtmlDialog'
    | 'newProcess'
    | 'newProgram'
    | 'newRestClient'
    | 'newWebServiceClient'
    | 'openConfig'
    | 'openCustomField'
    | 'openEndPage'
    | 'openOrCreateCmsCategory'
    | 'openPage'
    | 'openProgram'
    | 'openUrl';
  context: InscriptionElementContext;
  payload: string | OpenCustomField;
}
export interface OpenCustomField {
  name: string;
  type: WorkflowType;
}
