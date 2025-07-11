import type { Document, ElementScript, ScriptVariable, StartCustomStartField, WebserviceProcessConfig } from '../data/inscription';
import type { ElementData } from '../data/inscription-data';
import type {
  CacheData,
  CallData,
  ConditionData,
  ConfigurationData,
  DialogCallData,
  EndPageData,
  ErrorCatchData,
  ErrorThrowData,
  GeneralData,
  MailData,
  ProcessCallData,
  ProgramInterfaceStartData,
  QueryData,
  RequestData,
  RestRequestData,
  RestResponseData,
  ResultData,
  SignalCatchData,
  StartData,
  TriggerData,
  WebserviceStartData,
  WsRequestData
} from '../data/part-data';
import { IVY_EXCEPTIONS, MAIL_TYPE } from '../data/workflow-data';
import { DEFAULT_CASE_DATA, DEFAULT_TASK_DATA } from './workflow-defaults';

export const DEFAULT_NAME_DATA: GeneralData = {
  name: '',
  description: '',
  docs: [] as Document[],
  tags: [] as string[]
};

export const DEFAULT_OUTPUT_DATA: ElementScript = {
  output: {
    map: {},
    code: ''
  },
  sudo: false
} as const;

export const DEFAULT_CALL_DATA: CallData & DialogCallData & ProcessCallData = {
  dialog: '',
  processCall: '',
  call: {
    map: {},
    code: ''
  }
} as const;

export const DEFAULT_END_PAGE_DATA: EndPageData = {
  page: ''
} as const;

export const DEFAULT_CONDITION_DATA: ConditionData = {
  conditions: {}
} as const;

export const DEFAULT_START_DATA: StartData = {
  signature: '',
  input: {
    code: '',
    map: {},
    params: [] as ScriptVariable[]
  }
} as const;

export const DEFAULT_RESULT_DATA: ResultData = {
  result: {
    code: '',
    map: {},
    params: [] as ScriptVariable[]
  }
} as const;

export const DEFAULT_ERROR_CATCH_DATA: ErrorCatchData = {
  errorCode: ''
} as const;

export const DEFAULT_SIGNAL_CATCH_DATA: SignalCatchData = {
  signalCode: '',
  attachToBusinessCase: true
} as const;

export const DEFAULT_MAIL_DATA: Omit<MailData, 'exceptionHandler'> = {
  headers: {
    subject: '',
    from: '',
    replyTo: '',
    to: '',
    cc: '',
    bcc: ''
  },
  failIfMissingAttachments: false,
  attachments: [] as string[],
  message: { body: '', contentType: MAIL_TYPE.plain }
} as const;

export const DEFAULT_TRIGGER_DATA: Pick<TriggerData, 'triggerable'> = {
  triggerable: false
} as const;

export const DEFAULT_REQUEST_DATA: RequestData = {
  request: {
    isHttpRequestable: true,
    linkName: '',
    isVisibleOnStartList: true,
    name: '',
    description: '',
    category: '',
    customFields: [] as StartCustomStartField[]
  },
  permission: {
    anonymous: true,
    roles: ['Everybody'] as string[],
    error: IVY_EXCEPTIONS.security
  }
} as const;

export const DEFAULT_ERROR_THROW_DATA: ErrorThrowData = {
  throws: {
    cause: '',
    error: ''
  },
  code: ''
} as const;

export const DEFAULT_WEB_SERVICE_DATA: WebserviceStartData = {
  permission: {
    anonymous: true,
    error: IVY_EXCEPTIONS.security,
    roles: ['Everyone'] as string[]
  },
  exception: {
    enabled: false,
    condition: '',
    message: ''
  }
} as const;

export const DEFAULT_QUERY_DATA: Omit<QueryData, 'exceptionHandler'> = {
  query: {
    dbName: '',
    sql: {
      kind: 'READ',
      table: '',
      condition: '',
      fields: {},
      select: ['*'] as string[],
      orderBy: [] as string[],
      stmt: '',
      quote: false
    },
    offset: '0',
    limit: '2147483647'
  }
} as const;

export const DEFAULT_CACHE_DATA: CacheData = {
  cache: {
    mode: 'DO_NOT_CACHE',
    scope: 'APPLICATION',
    group: { name: '', invalidation: 'NONE', time: '' },
    entry: { name: '', invalidation: 'NONE', time: '' }
  }
} as const;

export const DEFAULT_WSPROCESS_DATA: WebserviceProcessConfig = {
  data: '',
  permissions: { view: { allowed: true } },
  wsAuth: 'NONE',
  wsTypeName: ''
} as const;

export const DEFAULT_WSREQUEST_DATA: WsRequestData = {
  clientId: '',
  operation: { name: '', port: '', parameters: {} },
  properties: {}
} as const;

export const DEFAULT_REST_RESPONSE_DATA: RestResponseData = {
  response: {
    entity: {
      type: '',
      map: {},
      code: ''
    },
    clientError: IVY_EXCEPTIONS.rest,
    statusError: IVY_EXCEPTIONS.rest
  }
} as const;

export const DEFAULT_REST_REQUEST_DATA: RestRequestData = {
  target: {
    clientId: '',
    path: '',
    templateParams: {},
    queryParams: {},
    headers: { Accept: '*/*' },
    properties: {}
  },
  body: {
    type: 'ENTITY',
    mediaType: 'application/json',
    form: {},
    raw: '',
    entity: {
      type: '',
      map: {},
      code: ''
    }
  },
  method: 'GET',
  code: ''
} as const;

export const DEFAULT_PROGRAM_INTERFACE_START_DATA: ProgramInterfaceStartData = {
  javaClass: '',
  exceptionHandler: '',
  timeout: {
    seconds: '',
    error: IVY_EXCEPTIONS.programTimeout,
    action: 'NOTHING',
    duration: ''
  }
} as const;

export const DEFAULT_CONFIGURATION_DATA: ConfigurationData = {
  javaClass: '',
  userConfig: {}
} as const;

export const DEFAULT_DATA: ElementData = {
  ...DEFAULT_NAME_DATA,
  config: {
    ...DEFAULT_CALL_DATA,
    ...DEFAULT_OUTPUT_DATA,
    ...DEFAULT_TASK_DATA,
    ...DEFAULT_CASE_DATA,
    ...DEFAULT_END_PAGE_DATA,
    ...DEFAULT_CONDITION_DATA,
    ...DEFAULT_START_DATA,
    ...DEFAULT_RESULT_DATA,
    ...DEFAULT_ERROR_CATCH_DATA,
    ...DEFAULT_SIGNAL_CATCH_DATA,
    ...DEFAULT_MAIL_DATA,
    ...DEFAULT_TRIGGER_DATA,
    ...DEFAULT_REQUEST_DATA,
    ...DEFAULT_ERROR_THROW_DATA,
    ...DEFAULT_QUERY_DATA,
    ...DEFAULT_CACHE_DATA,
    ...DEFAULT_WEB_SERVICE_DATA,
    ...DEFAULT_WSPROCESS_DATA,
    ...DEFAULT_WSREQUEST_DATA,
    ...DEFAULT_REST_RESPONSE_DATA,
    ...DEFAULT_REST_REQUEST_DATA,
    ...DEFAULT_PROGRAM_INTERFACE_START_DATA,
    ...DEFAULT_CONFIGURATION_DATA,
    // Other defaults, not implemented yet, but needed to satisfy TS
    guid: '',
    link: '',
    eventId: ''
  }
} as const;
