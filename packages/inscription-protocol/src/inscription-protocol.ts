/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  AddRoleRequest,
  ApiDocRequest,
  CallableDialogRequest,
  CallableStart,
  CategoryPathMeta,
  CmsMetaRequest,
  ConnectorRef,
  ContentObject,
  DatabaseColumn,
  DatabaseColumnRequest,
  DatabaseTablesRequest,
  DataclassType,
  ErrorCodeRequest,
  ErrorStartMeta,
  EventCodeMeta,
  Function,
  InscriptionActionArgs,
  InscriptionContext,
  InscriptionElementContext,
  JavaType,
  NewCmsStringRequest,
  OutlineNode,
  ProgramEditorRequest,
  ProgramInterface,
  ProgramInterfacesRequest,
  RestClient,
  RestClientRequest,
  RestContentTypeRequest,
  RestEntityInfoRequest,
  RestResource,
  RestResourceRequest,
  RoleMeta,
  ScriptingDataArgs,
  SignalCodeRequest,
  TypeSearchRequest,
  ValidationResult,
  VariableInfo,
  WebServiceClient,
  WebServiceClientRequest,
  WebServiceOperation,
  WebServicePortRequest,
  WfCustomField,
  Widget,
  WorkflowTypeRequest
} from './data/inscription';
import type { InscriptionData, InscriptionSaveData } from './data/inscription-data';

export interface InscriptionMetaRequestTypes {
  'meta/start/dialogs': [CallableDialogRequest, CallableStart[]];
  'meta/start/triggers': [InscriptionContext, CallableStart[]];
  'meta/start/calls': [InscriptionContext, CallableStart[]];

  'meta/workflow/roleTree': [InscriptionContext, RoleMeta];
  'meta/workflow/taskRoles': [InscriptionElementContext, RoleMeta[]];
  'meta/workflow/addRole': [AddRoleRequest, RoleMeta];
  'meta/workflow/errorStarts': [InscriptionElementContext, ErrorStartMeta[]];
  'meta/workflow/errorCodes': [ErrorCodeRequest, EventCodeMeta[]];
  'meta/workflow/signalCodes': [SignalCodeRequest, EventCodeMeta[]];
  'meta/workflow/notificationTemplates': [InscriptionContext, string[]];
  'meta/workflow/tags': [InscriptionElementContext, string[]];
  'meta/workflow/categoryPaths': [WorkflowTypeRequest, CategoryPathMeta[]];
  'meta/workflow/customFields': [WorkflowTypeRequest, WfCustomField[]];

  'meta/database/names': [InscriptionContext, string[]];
  'meta/database/tables': [DatabaseTablesRequest, string[]];
  'meta/database/columns': [DatabaseColumnRequest, DatabaseColumn[]];

  'meta/webservice/clients': [InscriptionContext, WebServiceClient[]];
  'meta/webservice/ports': [WebServiceClientRequest, string[]];
  'meta/webservice/operations': [WebServicePortRequest, WebServiceOperation[]];
  'meta/webservice/properties': [WebServiceClientRequest, string[]];

  'meta/rest/clients': [InscriptionContext, RestClient[]];
  'meta/rest/clientUri': [RestClientRequest, string];
  'meta/rest/resources': [RestClientRequest, RestResource[]];
  'meta/rest/resource': [RestResourceRequest, RestResource];
  'meta/rest/headers': [void, string[]];
  'meta/rest/contentTypes': [RestContentTypeRequest, string[]];
  'meta/rest/properties': [void, string[]];
  'meta/rest/entityTypes': [RestResourceRequest, string[]];
  'meta/rest/resultTypes': [RestResourceRequest, string[]];
  'meta/rest/entityInfo': [RestEntityInfoRequest, VariableInfo];

  'meta/scripting/out': [ScriptingDataArgs, VariableInfo];
  'meta/scripting/in': [ScriptingDataArgs, VariableInfo];
  'meta/scripting/dataClasses': [InscriptionContext, DataclassType[]];
  'meta/scripting/allTypes': [TypeSearchRequest, JavaType[]];
  'meta/scripting/ivyTypes': [void, JavaType[]];
  'meta/scripting/ownTypes': [TypeSearchRequest, JavaType[]];

  'meta/scripting/functions': [void, Function[]];

  'meta/scripting/apiDoc': [ApiDocRequest, string];

  'meta/program/types': [ProgramInterfacesRequest, ProgramInterface[]];
  'meta/program/editor': [ProgramEditorRequest, Widget[]];

  'meta/cms/tree': [CmsMetaRequest, ContentObject[]];
  'meta/cms/newCmsString': [NewCmsStringRequest, void];

  'meta/connector/out': [InscriptionElementContext, ConnectorRef[]];

  'meta/process/outline': [InscriptionElementContext, OutlineNode];
}

export interface InscriptionRequestTypes extends InscriptionMetaRequestTypes {
  initialize: [void, boolean];
  data: [InscriptionContext, InscriptionData];
  saveData: [InscriptionSaveData, ValidationResult[]];

  validate: [InscriptionContext, ValidationResult[]];

  action: [InscriptionActionArgs, void];
}

export interface InscriptionNotificationTypes {
  dataChanged: void;
  validation: ValidationResult[];
}
