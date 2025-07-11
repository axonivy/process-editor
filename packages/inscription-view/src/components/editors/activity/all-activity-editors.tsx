import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import type { KnownEditor } from '../InscriptionEditor';
import { bpmnActivityEditors } from './bpmn';
import { interfaceActivityEditors } from './interface';
import { workflowActivityEditors } from './workflow';

export const activityEditors = new Map<ElementType, KnownEditor>([
  ...workflowActivityEditors,
  ...interfaceActivityEditors,
  ...bpmnActivityEditors
]);
