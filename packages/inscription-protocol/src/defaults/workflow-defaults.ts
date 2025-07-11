import type { WfCustomField, WfPriority, WfResponsible, WfTask } from '../data/inscription';
import type { CaseData, TaskData } from '../data/part-data';

const DEFAULT_RESPONSIBLE: WfResponsible = {
  type: 'ROLES',
  script: '',
  roles: ['Everybody']
} as const;

const DEFAULT_PRIORITY: WfPriority = {
  level: 'NORMAL',
  script: ''
} as const;

export const DEFAULT_TASK: WfTask = {
  id: '',
  name: '',
  description: '',
  category: '',
  responsible: DEFAULT_RESPONSIBLE,
  priority: DEFAULT_PRIORITY,
  skipTasklist: false,
  notification: { suppress: false, template: 'Default' },
  delay: '',
  expiry: {
    timeout: '',
    error: '',
    responsible: DEFAULT_RESPONSIBLE,
    priority: DEFAULT_PRIORITY
  },
  customFields: [] as WfCustomField[],
  code: ''
} as const;

export const DEFAULT_TASK_DATA: TaskData = {
  task: DEFAULT_TASK,
  tasks: [] as WfTask[],
  persistOnStart: false
} as const;

export const DEFAULT_CASE_DATA: CaseData = {
  case: {
    name: '',
    description: '',
    category: '',
    customFields: [] as WfCustomField[],
    attachToBusinessCase: true
  }
} as const;
