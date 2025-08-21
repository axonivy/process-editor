import type { ElementType, GeneralData } from '@axonivy/process-editor-inscription-protocol';
import { DEFAULT_TASK } from '@axonivy/process-editor-inscription-protocol';
import { deepmerge } from 'deepmerge-ts';

export namespace DataMock {
  export const NAME: GeneralData = {
    name: 'test name',
    description: 'test desc',
    docs: [
      {
        name: 'Doc 1',
        url: 'axonivy.com'
      },
      {
        name: 'ivyTeam ❤️',
        url: 'ivyteam.ch'
      }
    ],
    tags: ['bla', 'zag']
  };

  export const USER_TASK = {
    ...NAME,
    config: {
      dialog: '',
      call: {
        map: { 'param.procurementRequest': 'in' },
        code: 'ivy.log.info("Hello World")'
      },
      task: {
        name: 'user task',
        notification: { suppress: false, template: 'Default' }
      },
      case: {
        name: 'case <%=ivy.cms.co("/Case/name")%> bla <%= in.name %>',
        description: `<%=ivy.cms.co("/Emails/yourRequestHasBeen")%> 
blalbalba
<%=in.amount%> and <%=in.description%> 
<%=ivy.cms.co("/Dialogs/procurementRequest/forTotal")%> <%=in.totalPrice%> 
<%=ivy.cms.co("/Dialogs/procurementRequest/currencySymbol")%>`
      },
      output: {
        map: {
          'out.amount': '123',
          'out.accepted': 'true'
        }
      }
    }
  };

  export const TASK_SWITCH_GATEWAY = {
    ...NAME,
    config: {
      tasks: [deepmerge(DEFAULT_TASK, { id: 'TaskA', name: 'TaskA' }), deepmerge(DEFAULT_TASK, { id: 'TaskB', name: 'TaskB' })]
    }
  };

  export const ALTERNATIVE = {
    ...NAME,
    config: {
      conditions: {
        f1: 'false',
        f6: ''
      }
    }
  };

  export const DATABASE = {
    ...NAME,
    config: {
      query: {
        dbName: ['testDatabase'],
        sql: {
          kind: 'READ',
          table: 'cool Table',
          condition: '',
          fields: {},
          select: ['*'] as string[],
          orderBy: [] as string[],
          stmt: '',
          quote: false
        }
      }
    }
  };

  export const PROGRAM = {
    ...NAME,
    config: {
      javaClass: 'com.axonivy.utils.ai.tools.AgenticProcessCall',
      userConfig: {
        query: 'Help me, my computer is beeping with <%= in.error %> .',
        system: 'You are a polite and helpful Support Agent trying to achieve <%= in.goal %> ',
        returnType: 'com.axonivy.utils.ai.SupportTicket.class'
      }
    }
  };

  export function mockForType(type: ElementType) {
    switch (type) {
      case 'UserTask':
      case 'DialogCall':
        return DataMock.USER_TASK;
      case 'TaskSwitchGateway':
        return DataMock.TASK_SWITCH_GATEWAY;
      case 'Alternative':
        return DataMock.ALTERNATIVE;
      case 'Database':
        return DataMock.DATABASE;
      case 'ProgramInterface':
        return DataMock.PROGRAM;
      default:
        return DataMock.NAME;
    }
  }
}
