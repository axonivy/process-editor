import type {
  CallableStart,
  CategoryPathMeta,
  ConnectorRef,
  ContentObject,
  DatabaseColumn,
  DataclassType,
  ErrorStartMeta,
  Group,
  JavaType,
  NodeRef,
  OutlineNode,
  RoleMeta,
  VariableInfo
} from '@axonivy/process-editor-inscription-protocol';

export namespace MetaMock {
  const USER_INFO_TYPE = [
    {
      attribute: 'email',
      type: 'String',
      simpleType: 'String',
      description: ''
    },
    {
      attribute: 'fullName',
      type: 'String',
      simpleType: 'String',
      description: ''
    },
    {
      attribute: 'role',
      type: 'String',
      simpleType: 'String',
      description: ''
    }
  ];

  const MAP_INFO_TYPES = {
    'workflow.humantask.ProcurementRequest': [
      {
        attribute: 'accepted',
        type: 'Boolean',
        simpleType: 'Boolean',
        description: ''
      },
      {
        attribute: 'activityLog',
        type: 'List<workflow.humantask.LogEntry>',
        simpleType: 'List<LogEntry>',
        description: ''
      },
      {
        attribute: 'amount',
        type: 'Number',
        simpleType: 'Number',
        description: ''
      },
      {
        attribute: 'dataOkManager',
        type: 'Boolean',
        simpleType: 'Boolean',
        description: ''
      },
      {
        attribute: 'dataOkTeamLeader',
        type: 'Boolean',
        simpleType: 'Boolean',
        description: ''
      },
      {
        attribute: 'description',
        type: 'String',
        simpleType: 'String',
        description: ''
      },
      {
        attribute: 'notes',
        type: 'String',
        simpleType: 'String',
        description: ''
      },
      {
        attribute: 'pricePerUnit',
        type: 'Number',
        simpleType: 'Number',
        description: ''
      },
      {
        attribute: 'requester',
        type: 'workflow.humantask.User',
        simpleType: 'User',
        description: ''
      },
      {
        attribute: 'totalPrice',
        type: 'Number',
        simpleType: 'Number',
        description: ''
      }
    ],
    'workflow.humantask.User': USER_INFO_TYPE
  };

  const IN_INFO_TYPES = {
    'mock.Test': [
      {
        attribute: 'bla',
        type: 'Boolean',
        simpleType: 'Boolean',
        description: ''
      },
      {
        attribute: 'user',
        type: 'workflow.humantask.User',
        simpleType: 'User',
        description: ''
      }
    ],
    'workflow.humantask.User': USER_INFO_TYPE
  };

  export const OUT_VAR_INFO: VariableInfo = {
    variables: [
      {
        attribute: 'out',
        type: 'workflow.humantask.ProcurementRequest',
        simpleType: 'ProcurementRequest',
        description: ''
      }
    ],
    types: MAP_INFO_TYPES
  };

  export const CMS_TYPE: ContentObject[] = [
    {
      name: 'Macro',
      fullPath: '/Macro',
      type: 'STRING',
      values: {
        en: '<%=ivy.html.get("in.date")%> <%=ivy.cms.co("/ProcessPages/test/Panel1")%>'
      },
      children: []
    },
    {
      name: 'BlaFile',
      fullPath: '/BlaFile',
      type: 'FILE',
      values: {},
      children: []
    },
    {
      name: 'hallo',
      fullPath: '/hallo',
      type: 'STRING',
      values: {
        en: 'hello'
      },
      children: []
    }
  ];

  export const DATACLASS: DataclassType[] = [
    {
      name: 'Person',
      fullQualifiedName: 'ch.ivyteam.test.Person',
      packageName: 'ch.ivyteam.test',
      path: 'dataclasses/ch/ivyteam/test/Person.ivyClass'
    },
    {
      name: 'List',
      packageName: 'java.util',
      fullQualifiedName: 'java.util.List',
      path: 'thisisaTest'
    }
  ];

  export const CATPATH: CategoryPathMeta[] = [
    {
      path: 'Dossier',
      process: '<INVALID>',
      project: 'inscription-screenshot',
      usage: 2
    },
    {
      path: 'Personal/Tasks',
      process: 'exampleProcess',
      project: 'inscription-integration',
      usage: 1
    }
  ];

  export const RESULT_VAR_INFO: VariableInfo = {
    variables: [
      {
        attribute: 'result',
        type: '<>',
        simpleType: '<>',
        description: ''
      }
    ],
    types: {}
  };

  export const IN_VAR_INFO: VariableInfo = {
    variables: [
      {
        attribute: 'in',
        type: 'mock.Test',
        simpleType: 'Test',
        description: ''
      }
    ],
    types: IN_INFO_TYPES
  };

  export const DATATYPE: JavaType[] = [
    {
      simpleName: 'AddContactData',
      fullQualifiedName: 'ch.ivyteam.documentation.project.AddContactData',
      packageName: 'ch.ivyteam.documentation.project'
    },
    {
      simpleName: 'Person',
      fullQualifiedName: 'ch.ivyteam.test.Person',
      packageName: 'ch.ivyteam.test'
    },
    {
      simpleName: 'List',
      packageName: 'java.util',
      fullQualifiedName: 'java.util.List'
    }
  ];

  export const CALLABLE_STARTS: CallableStart[] = [
    {
      id: 'workflow.humantask.AcceptRequest:start(workflow.humantask.ProcurementRequest)',
      process: 'AcceptRequest',
      packageName: 'workflow.humantask',
      description: '',
      startName: 'start(workflow.humantask.ProcurementRequest)',
      project: 'workflow-demos',
      deprecated: false,
      callParameter: {
        variables: [
          {
            attribute: 'param.procurementRequest',
            type: 'workflow.humantask.ProcurementRequest',
            simpleType: 'ProcurementRequest',
            description: 'this is a description'
          }
        ],
        types: MAP_INFO_TYPES
      }
    },
    {
      id: 'workflow.humantask.AcceptRequest:start2()',
      process: 'AcceptRequest',
      startName: 'start2()',
      description: '',
      packageName: 'workflow.humantask',
      project: 'workflow-demos',
      deprecated: true,
      callParameter: {
        variables: [],
        types: {}
      }
    },
    {
      id: 'demo.test1:start()',
      process: 'test1',
      startName: 'start()',
      description: '',
      packageName: 'demo',
      project: 'demo',
      deprecated: false,
      callParameter: {
        variables: [
          {
            attribute: 'param.Endless',
            type: 'demo.Endless',
            simpleType: 'Endless',
            description: ''
          }
        ],
        types: {
          'demo.Endless': [
            {
              attribute: 'endless',
              type: 'demo.Endless',
              simpleType: 'Endless',
              description: ''
            }
          ]
        }
      }
    }
  ];

  export const DATABASE: DatabaseColumn[] = [
    {
      ivyType: 'TestIvyType',
      name: 'Test Column',
      type: 'String'
    },
    {
      ivyType: 'SpecialTestIvyType',
      name: 'Cool Column',
      type: 'Boolean'
    }
  ];

  export const ROLES: RoleMeta = {
    id: 'Everybody',
    label: 'In this role is everyone',
    children: [
      { id: 'Employee', label: '', children: [] },
      { id: 'Teamleader', label: '', children: [] }
    ]
  };

  export const EXPIRY_ERRORS: ErrorStartMeta[] = [
    { label: 'ProcurementRequestParallel -> error:task', id: 'f29' },
    { label: 'ProcurementRequestParallel -> error:task:bla', id: 'f31' }
  ];

  export const NOTIFICATION_TEMPLATES: string[] = ['Default', 'Customer', 'Employee'];

  const NODE_OF: NodeRef = {
    pid: '1',
    name: 'Mock Element',
    type: {
      id: 'GenericActivity',
      label: 'Mock Element',
      shortLabel: 'Element',
      description: 'This is a mock element',
      iconId: 'mock icon',
      impl: '',
      helpUrl: 'mock url'
    }
  };

  export const CONNECTORS_OUT: ConnectorRef[] = [
    {
      pid: '169A4921D0EF0B91-f1',
      name: '',
      source: NODE_OF,
      target: NODE_OF
    }
  ];

  export const PROGRAM_EDITOR: Group[] = [
    {
      name: 'Prompt',
      widgets: [
        {
          text: 'User:',
          widgetType: 'LABEL',
          multiline: false
        },
        {
          text: 'in.data',
          widgetType: 'TEXT',
          configKey: 'query',
          multiline: true
        },
        {
          text: 'System:',
          widgetType: 'LABEL',
          multiline: false
        },
        {
          text: 'in.system',
          widgetType: 'TEXT',
          configKey: 'system',
          multiline: false
        }
      ]
    },
    {
      name: 'Output',
      widgets: [
        {
          text: 'Return type:',
          widgetType: 'LABEL',
          multiline: false
        },
        {
          text: 'macronized',
          widgetType: 'SCRIPT',
          configKey: 'returnType',
          requiredType: 'java.lang.Class',
          multiline: false
        }
      ]
    },
    {
      name: 'Model',
      widgets: [
        {
          items: [
            {
              id: 'whoami',
              label: 'WhoAmI',
              description: 'identifies the current user',
              icon: '🪪️'
            },
            {
              id: 'add',
              label: 'Add',
              description: 'calculation universe',
              icon: 'https://imgcdn.stablediffusionweb.com/2024/12/15/3388743d-2e7a-4cd2-a17c-cba86a6573bd.jpg'
            },
            {
              id: 'weather',
              label: 'Weather',
              description: 'provides weather information',
              icon: '⛅️'
            },
            {
              id: 'websearch',
              label: 'Web Search',
              description: 'latest web search results',
              icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMTg0IDE0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNNjkuOTQyIDEyOS4yNkg2Ni40NmwtNi4zMzggNi41MTd2LTEzLjAzM2gtMi42Nzh2MjIuMjI4aDIuNjc4di03LjMybDcuMjMgNy4yMy4wOS4wOWgzLjIxNHYtLjI2OGwtOC4xMjQtOC4wMzR6bS0xNy4xNCAxMS44NzNjLS45ODIuOTgyLTIuNDEgMS41MTgtNC4wMTcgMS41MTgtMi43NjcgMC01LjUzNC0xLjY5Ni01LjUzNC01LjYyNCAwLTMuMzAzIDIuMzItNS42MjQgNS41MzQtNS42MjQgMS40MjggMCAyLjc2Ny41MzYgMy44MzkgMS41MThsLjA4OS4wODkgMS42OTYtMS43ODYtLjA5LS4wODljLTEuNjA2LTEuNTE3LTMuNDgtMi4yMzItNS42MjMtMi4yMzItNC45MSAwLTguMjEzIDMuMzAzLTguMjEzIDguMTI0IDAgNS42MjQgNC4xMDYgOC4xMjMgOC4yMTMgOC4xMjNoLjA5YzIuMTQxIDAgNC4xOTUtLjgwMyA1LjYyMy0yLjMyMWwuMDktLjA4OS0xLjc4Ni0xLjc4NXptLTE4LjEyMi0zLjQ4MWMwIDIuODU2LTEuOTYzIDQuOTk5LTQuNzMgNS4wODgtMi45NDYgMC00LjczMi0xLjc4NS00LjczMi00Ljgydi04LjY2SDIyLjU0djguNjZjMCA0LjQ2MyAyLjY3OCA3LjMyIDYuODc0IDcuMzJoLjA5YzIuMDUyIDAgMy45MjctLjk4MiA1LjE3Ny0yLjVsLjA4OS0uMTc5LjA5IDIuNDExaDIuNDk5VjEyOS4yNkgzNC42OHpNOC4zNDcgMTIyLjY1NUguMjIzdjIyLjMxN2g4LjEyNGM3Ljc2NiAwIDExLjE1OC01LjcxMyAxMS4xNTgtMTEuMzM3IDAtNS4yNjctMy40ODEtMTAuOTgtMTEuMTU4LTEwLjk4em04LjM5IDEwLjg5YzAgNC4yODUtMi41ODggOC41Ny04LjMwMSA4LjU3SDMuMDh2LTE2LjY5M2g1LjI2N2M1LjcxMyAwIDguMzkgNC4xOTYgOC4zOSA4LjEyM3ptMTM4LjI3NyAxLjY5N2g2Ljg3NHY1LjE3N2MtMS42OTYgMS40MjgtMy43NDkgMi4yMzItNS45ODEgMi4yMzItNi4wNyAwLTguODM4LTQuMzc0LTguODM4LTguNjU5IDAtNC4zNzQgMi43NjgtOS4xMDYgOC43NDktOS4xMDYgMi40MSAwIDQuNjQyLjg5MyA2LjQyNyAyLjVsLjA4OS4wODkgMS42MDctMS44NzQtLjA4OS0uMDljLTIuMTQzLTIuMTQyLTQuOTk5LTMuMjEzLTguMTI0LTMuMjEzLTMuMzkyIDAtNi4yNDggMS4wNzEtOC4zMDIgMy4yMTMtMi4xNDIgMi4xNDMtMy4zMDIgNS4xNzgtMy4yMTMgOC41NyAwIDUuMjY3IDMuMDM1IDExLjMzNyAxMS42MDUgMTEuMzM3aC4xNzhjMy4yMTQgMCA2LjI0OS0xLjMzOSA4LjM5MS0zLjc0OXYtOC44MzhoLTkuNDYydjIuNDExem0tNzMuNzM1LTEyLjU4N2gtOC4xMjR2MjIuMzE3aDguMTI0YzcuNzY2IDAgMTEuMTU4LTUuNzEzIDExLjE1OC0xMS4zMzcgMC01LjI2Ny0zLjQ4MS0xMC45OC0xMS4xNTgtMTAuOTh6bTguMzkgMTAuODljMCA0LjI4NS0yLjU4OCA4LjU3LTguMzAxIDguNTdoLTUuMjY3di0xNi42OTNoNS4yNjdjNS42MjQgMCA4LjMwMiA0LjE5NiA4LjMwMiA4LjEyM3ptODUuNjA5LTQuNjQyYy00LjczMSAwLTguMTIzIDMuNDgyLTguMTIzIDguMjEzczMuMzkyIDguMTI0IDguMTIzIDguMTI0IDguMjEzLTMuMzkzIDguMjEzLTguMTI0YzAtNC44Mi0zLjM5Mi04LjIxMy04LjIxMy04LjIxM3ptNS41MzUgOC4yMTNjMCAzLjMwMy0yLjMyMSA1LjYyNC01LjUzNSA1LjYyNC0zLjEyNCAwLTUuNDQ1LTIuMzIxLTUuNDQ1LTUuNjI0IDAtMy4zOTIgMi4yMzItNS44MDIgNS41MzQtNS44MDIgMy4xMjUuMDg5IDUuNDQ2IDIuNDk5IDUuNDQ2IDUuODAyem0tNzMuMi41MzZjMCAyLjg1Ni0xLjk2NCA0Ljk5OS00LjczMSA1LjA4OC0yLjk0NiAwLTQuNzMxLTEuNzg1LTQuNzMxLTQuODJ2LTguNjZoLTIuNjc5djguNjZjMCA0LjQ2MyAyLjY3OSA3LjMyIDYuNzg1IDcuMzJoLjA4OWMyLjA1MyAwIDMuOTI4LS45ODIgNS4xNzgtMi41bC4wODktLjE3OS4wODkgMi40MTFoMi41VjEyOS4yNmgtMi42Nzh2OC4zOTJ6bTE4LjEyMSAzLjQ4MWMtLjk4Mi45ODItMi40MSAxLjUxOC00LjAxNyAxLjUxOC0yLjc2NyAwLTUuNTM0LTEuNjk2LTUuNTM0LTUuNjI0IDAtMy4zMDMgMi4zMjEtNS42MjQgNS41MzQtNS42MjQgMS40MjkgMCAyLjc2OC41MzYgMy44MzkgMS41MThsLjA4OS4wODkgMS42OTYtMS43ODYtLjA4OS0uMDg5Yy0xLjYwNy0xLjUxNy0zLjQ4Mi0yLjIzMi01LjYyNC0yLjIzMi00LjkxIDAtOC4yMTMgMy4zMDMtOC4yMTMgOC4xMjQgMCA1LjYyNCA0LjEwNyA4LjEyMyA4LjIxMyA4LjEyM2guMDg5YzIuMTQzIDAgNC4xOTYtLjgwMyA1LjYyNC0yLjMyMWwuMDg5LS4wODktMS43ODUtMS43ODV6bTE3LjE0LTExLjg3M2gtMy40ODJsLTYuMzM4IDYuNTE3di0xMy4wMzNoLTIuNjc4djIyLjIyOGgyLjY3OHYtNy4zMmw3LjIzMSA3LjIzLjA4OS4wOWgzLjIxNHYtLjI2OGwtOC4xMjMtOC4wMzR6Ii8+CiAgPHBhdGggZmlsbD0iI2RlNTgzMyIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOTEuOTQ2IDEwNy4xMjJjMjkuNTgxIDAgNTMuNTYxLTIzLjk4IDUzLjU2MS01My41NjFTMTIxLjUyNyAwIDkxLjk0NyAwQzYyLjM2NCAwIDM4LjM4NCAyMy45OCAzOC4zODQgNTMuNTYxczIzLjk4IDUzLjU2MSA1My41NjEgNTMuNTYxeiIgY2xpcC1ydWxlPSJldmVub2RkIi8+CiAgPHBhdGggZmlsbD0iI2RkZCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOTkuNDc4IDkzLjUyMmMwLS40MTguMTAzLS41MTMtMS4yMjctMy4xNjUtMy41MzUtNy4wNzktNy4wODgtMTcuMDU5LTUuNDcyLTIzLjQ5NS4yOTQtMS4xNy0zLjMzLTQzLjMwNC01Ljg5Mi00NC42NjEtMi44NDgtMS41MTgtNi4zNTEtMy45MjUtOS41NTYtNC40Ni0xLjYyNi0uMjYtMy43NTgtLjEzOC01LjQyNS4wODctLjI5Ni4wNC0uMzA4LjU3Mi0uMDI1LjY2OCAxLjA5NC4zNyAyLjQyMyAxLjAxNCAzLjIwNiAxLjk4OC4xNDguMTg0LS4wNTEuNDc0LS4yODcuNDgyLS43MzguMDI4LTIuMDc3LjMzNy0zLjg0NCAxLjgzOC0uMjA0LjE3My0uMDM1LjQ5NS4yMjguNDQzIDMuNzk3LS43NSA3LjY3NC0uMzggOS45NiAxLjY5Ni4xNDguMTM1LjA3LjM3Ny0uMTIzLjQzQzYxLjE5IDMwLjc2IDY1LjExNyA0OC4wMSA3MC4zOTYgNjkuMTc3YzQuNjU0IDE4LjY2NiA2LjQzNSAyNC44MSA3LjAxMiAyNi43MjdhLjcyLjcyIDAgMCAwIC40MjQuNDY5YzYuODUgMi42OTcgMjEuNjQ2IDIuODA1IDIxLjY0Ni0xLjgwNXoiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPgogIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMDIuMTk4IDk3LjQ5OGMtMi40MDYuOTQxLTcuMTE0IDEuMzYtOS44MzMgMS4zNi0zLjk4OCAwLTkuNzMtLjYyOC0xMS44MjEtMS41Ny0xLjI5My0zLjk3Ni01LjE2LTE2LjMwMy04Ljk3OC0zMS45NTZsLS4zNzQtMS41My0uMDAzLS4wMTJjLTQuNTQtMTguNTQyLTguMjQ4LTMzLjY4NyAxMi4wNzQtMzguNDQ1LjE4NS0uMDQzLjI3Ni0uMjY1LjE1My0uNDExLTIuMzMxLTIuNzY2LTYuNy0zLjY3My0xMi4yMjItMS43NjgtLjIyNy4wNzktLjQyNC0uMTUtLjI4My0uMzQ0IDEuMDgzLTEuNDkzIDMuMi0yLjY0IDQuMjQ0LTMuMTQ0LjIxNi0uMTA0LjIwMy0uNDItLjAyNS0uNDkxYTIzLjI5OSAyMy4yOTkgMCAwIDAtMy4xNTYtLjc1M2MtLjMxLS4wNS0uMzM4LS41OC0uMDI3LS42MjMgNy44My0xLjA1MyAxNi4wMDYgMS4yOTggMjAuMTA5IDYuNDY2YS4yNzIuMjcyIDAgMCAwIC4xNTUuMDk2YzE1LjAyNCAzLjIyNiAxNi4xIDI2Ljk3NyAxNC4zNjkgMjguMDU5LS4zNDEuMjEzLTEuNDM0LjA5LTIuODc3LS4wNy01Ljg0Ni0uNjU1LTE3LjQyMi0xLjk1LTcuODY4IDE1Ljg1Ni4wOTQuMTc2LS4wMy40MDktLjIyOC40NC01LjM4OC44MzcgMS41MTcgMTcuNzE5IDYuNTkxIDI4Ljg0eiIvPgogIDxwYXRoIGZpbGw9IiMzY2E4MmIiIGQ9Ik0xMDguOTE5IDc1LjkwNGMtMS4xNDQtLjUzLTUuNTQyIDIuNjI0LTguNDYxIDUuMDQ1LS42MS0uODYzLTEuNzYtMS40OS00LjM1NS0xLjA0LTIuMjcuMzk2LTMuNTI0Ljk0My00LjA4NCAxLjg4Ny0zLjU4NC0xLjM1OS05LjYxNC0zLjQ1Ni0xMS4wNy0xLjQzLTEuNTkzIDIuMjE0LjM5NyAxMi42ODcgMi41MTIgMTQuMDQ3IDEuMTA0LjcxIDYuMzg2LTIuNjg1IDkuMTQ0LTUuMDI2LjQ0NS42MjcgMS4xNjIuOTg2IDIuNjM0Ljk1MiAyLjIyOC0uMDUyIDUuODQxLS41NyA2LjQwMS0xLjYwOC4wMzQtLjA2My4wNjQtLjEzNy4wODktLjIyMiAyLjgzNSAxLjA2IDcuODI0IDIuMTggOC45MzkgMi4wMTQgMi45MDUtLjQzNy0uNDA1LTEzLjk5Ni0xLjc0OS0xNC42MTl6Ii8+CiAgPHBhdGggZmlsbD0iIzRjYmEzYyIgZD0iTTEwMC43MjUgODEuMjZjLjEyMS4yMTQuMjE3LjQ0LjMuNjcuNDA0IDEuMTMgMS4wNjIgNC43MjYuNTY0IDUuNjE0LS40OTguODg4LTMuNzMyIDEuMzE3LTUuNzI3IDEuMzUxcy0yLjQ0NC0uNjk1LTIuODQ4LTEuODI1Yy0uMzI0LS45MDQtLjQ4My0zLjAzLS40NzktNC4yNDctLjA4Mi0xLjgwNi41NzgtMi40NCAzLjYyNy0yLjkzNCAyLjI1Ny0uMzY1IDMuNDUuMDYgNC4xMzguNzg2IDMuMjA0LTIuMzkgOC41NDktNS43NjUgOS4wNy01LjE0OCAyLjYgMy4wNzUgMi45MjggMTAuMzk0IDIuMzY1IDEzLjM0LS4xODQuOTYyLTguNzkxLS45NTUtOC43OTEtMS45OTMgMC00LjMxMS0xLjExOS01LjQ5NC0yLjIxOS01LjYxNXpNODEuODcgNzkuOTEzYy43MDYtMS4xMTYgNi40MjIuMjcyIDkuNTYgMS42NjggMCAwLS42NDQgMi45MjIuMzgyIDYuMzY0LjMgMS4wMDctNy4yMiA1LjQ4OC04LjIwMSA0LjcxNy0xLjEzNC0uODkxLTMuMjIyLTEwLjQwNC0xLjc0LTEyLjc1eiIvPgogIDxwYXRoIGZpbGw9IiNmYzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTg0LjY0IDU3LjI0OWMuNDYyLTIuMDEyIDIuNjE3LTUuODAyIDEwLjMxLTUuNzEgMy44OS0uMDE2IDguNzIyLS4wMDEgMTEuOTI2LS4zNjVhNDIuODg1IDQyLjg4NSAwIDAgMCAxMC42NS0yLjU5YzMuMzMxLTEuMjcgNC41MTMtLjk4OCA0LjkyNy0uMjI3LjQ1Ni44MzUtLjA4MSAyLjI3OC0xLjI0NSAzLjYwNi0yLjIyMyAyLjUzNi02LjIxOSA0LjUwMi0xMy4yNzcgNS4wODUtNy4wNTguNTgzLTExLjczNC0xLjMxLTEzLjc0NiAxLjc3Mi0uODY4IDEuMzMtLjE5NyA0LjQ2MyA2LjYyOCA1LjQ1IDkuMjIzIDEuMzMgMTYuNzk4LTEuNjA0IDE3LjczNC4xNjhzLTQuNDU1IDUuMzgtMTMuNjkzIDUuNDU1Yy05LjIzOS4wNzYtMTUuMDA5LTMuMjM0LTE3LjA1NS00Ljg4LTIuNTk3LTIuMDg3LTMuNzU4LTUuMTMyLTMuMTYtNy43NjR6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8ZyBmaWxsPSIjMTQzMDdlIiBvcGFjaXR5PSIuOCI+CiAgICA8cGF0aCBkPSJNOTYuNDA0IDM1LjI1NmMuNTE2LS44NDQgMS42NTgtMS40OTUgMy41MjgtMS40OTVzMi43NS43NDQgMy4zNTkgMS41NzNjLjEyNC4xNy0uMDY0LjM2OC0uMjU2LjI4NWwtLjE0LS4wNjFjLS42ODQtLjI5OS0xLjUyNC0uNjY2LTIuOTYzLS42ODYtMS41MzgtLjAyMi0yLjUwOC4zNjMtMy4xMi42OTUtLjIwNS4xMTItLjUzLS4xMTEtLjQwOC0uMzExem0tMjEuMDUzIDEuMDc5YzEuODE2LS43NTkgMy4yNDMtLjY2IDQuMjUyLS40MjIuMjEzLjA1LjM2LS4xNzguMTktLjMxNS0uNzgzLS42MzItMi41MzUtMS40MTYtNC44MjEtLjU2NC0yLjAzOS43Ni0zIDIuMzQtMy4wMDYgMy4zNzktLjAwMS4yNDUuNTAzLjI2NS42MzMuMDU4LjM1Mi0uNTYuOTM3LTEuMzc3IDIuNzUyLTIuMTM2eiIvPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTAxLjUyMSA0Ni43OTljLTEuNjA2IDAtMi45MDgtMS4yOTktMi45MDgtMi44OTdzMS4zMDItMi44OTcgMi45MDgtMi44OTdjMS42MDUgMCAyLjkwNyAxLjI5OSAyLjkwNyAyLjg5N3MtMS4zMDIgMi44OTctMi45MDcgMi44OTd6bTIuMDQ3LTMuODU3YS43NTIuNzUyIDAgMCAwLTEuNTA1IDAgLjc1Mi43NTIgMCAwIDAgMS41MDUgMHptLTIxLjMxIDIuOTY1YTMuMzgzIDMuMzgzIDAgMCAxLTMuMzg5IDMuMzc4Yy0xLjg3IDAtMy4zODktMS41MTMtMy4zODktMy4zNzhzMS41Mi0zLjM3OSAzLjM4OS0zLjM3OWEzLjM4NSAzLjM4NSAwIDAgMSAzLjM4OSAzLjM3OXptLS45OTktMS4xMmEuODc4Ljg3OCAwIDAgMC0xLjc1NSAwIC44NzYuODc2IDAgMCAwIDEuNzU1IDB6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KICA8L2c+CiAgPHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNOTEuOTQ2IDk4LjU0NGMyNC44NDMgMCA0NC45ODMtMjAuMTQgNDQuOTgzLTQ0Ljk4MyAwLTI0Ljg0My0yMC4xNC00NC45ODMtNDQuOTgzLTQ0Ljk4My0yNC44NDMgMC00NC45ODMgMjAuMTQtNDQuOTgzIDQ0Ljk4MyAwIDI0Ljg0MyAyMC4xNCA0NC45ODMgNDQuOTgzIDQ0Ljk4M3ptMCA0LjE4NGMyNy4xNTQgMCA0OS4xNjctMjIuMDEzIDQ5LjE2Ny00OS4xNjdTMTE5LjEgNC4zOTQgOTEuOTQ2IDQuMzk0IDQyLjc4IDI2LjQwNyA0Mi43OCA1My41NnMyMi4wMTMgNDkuMTY3IDQ5LjE2NyA0OS4xNjd6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg=='
            }
          ],
          widgetType: 'MULTI_SELECT',
          configKey: 'tools',
          multiline: false
        }
      ]
    }
  ];

  export const OUTLINE: OutlineNode = {
    id: '15254DC87A1B183B',
    title: 'ProcurementRequestParallel',
    info: 'Business Process',
    type: 'Process',
    children: [
      {
        id: '15254DC87A1B183B-f3',
        title: 'User Dialog',
        info: 'Enter Request',
        type: 'ACTIVITY',
        children: [{ id: '15254DC87A1B183B-f22', title: 'Error Boundary', info: '', type: 'EVENT_BOUNDARY', children: [] }]
      },
      { id: '15254DC87A1B183B-f8', title: 'E-Mail', info: 'Notify Requester', type: 'ACTIVITY', children: [] },
      { id: '15254DC87A1B183B-f16', title: 'User Dialog', info: 'Accept Request', type: 'ACTIVITY', children: [] },
      {
        id: '15254DC87A1B183B-f14',
        title: 'Note',
        info: 'This example shows the use of a Parallel Task Switch Gateway.\nA procurement request is made by an employee, verified by the team leader and by a manager \nand accepted by an executive.',
        type: 'ACTIVITY',
        children: []
      },
      {
        id: '15254DC87A1B183B-S10',
        title: 'Sub',
        info: 'Sub 1',
        type: 'ACTIVITY',
        children: [
          { id: '15254DC87A1B183B-S10-f6', title: 'User Dialog', info: 'Verify Request\nby Manager', type: 'ACTIVITY', children: [] },
          {
            id: '15254DC87A1B183B-S10-f24',
            title: 'Note',
            info: "This is a gateway with a task switch.\nYou can use it to delegate parallel tasks to different users.\nDon't use the Split-Gateway to implement this, because there \nwill be problems with the session handling.",
            type: 'ACTIVITY',
            children: []
          },
          { id: '15254DC87A1B183B-S10-f5', title: 'User Dialog', info: 'Verify Request\nby Team Leader', type: 'ACTIVITY', children: [] },
          { id: '15254DC87A1B183B-S10-g1', title: 'Embedded End', info: 'out 1', type: 'EVENT_END', children: [] },
          { id: '15254DC87A1B183B-S10-g0', title: 'Embedded Start', info: 'in 1', type: 'EVENT_START', children: [] },
          { id: '15254DC87A1B183B-S10-f7', title: 'Tasks', info: '', type: 'GATEWAY', children: [] },
          { id: '15254DC87A1B183B-S10-f2', title: 'Tasks', info: '', type: 'GATEWAY', children: [] }
        ]
      },
      { id: '15254DC87A1B183B-f1', title: 'End', info: '', type: 'EVENT_END', children: [] },
      { id: '15254DC87A1B183B-f26', title: 'Task', info: '', type: 'EVENT_INTERMEDIATE', children: [] },
      { id: '15254DC87A1B183B-f0', title: 'Start', info: 'start.ivp', type: 'EVENT_START', children: [] },
      { id: '15254DC87A1B183B-f19', title: 'Alternative', info: 'Verified?', type: 'GATEWAY', children: [] }
    ]
  };
}
