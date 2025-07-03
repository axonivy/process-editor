import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import NameEditor from '../NameEditor';
import { IvyIcons } from '@axonivy/ui-icons';
import Part from '../part/Part';
import { useDialogCallPart } from '../../parts/call/dialog/DialogCallPart';
import { useSubCallPart } from '../../parts/call/sub/SubCallPart';
import { useTriggerCallPart } from '../../parts/call/trigger/TriggerCallPart';
import { useCasePart } from '../../parts/case/CasePart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useOutputPart } from '../../parts/output/OutputPart';
import { useTaskPart } from '../../parts/task/TaskPart';

const DialogCallEditor = memo(() => {
  const name = useGeneralPart();
  const dialog = useDialogCallPart();
  const output = useOutputPart();
  return <Part parts={[name, dialog, output]} />;
});

const UserTaskEditor = memo(() => {
  const name = useGeneralPart();
  const dialog = useDialogCallPart({ offline: true });
  const task = useTaskPart();
  const casePart = useCasePart();
  const output = useOutputPart();
  return <Part parts={[name, task, casePart, dialog, output]} />;
});

const ScriptEditor = memo(() => {
  const name = useGeneralPart();
  const output = useOutputPart({ showSudo: true, additionalBrowsers: ['cms'], defaultOpenCode: true });
  return <Part parts={[name, output]} />;
});

const SubProcessCallEditor = memo(() => {
  const name = useGeneralPart();
  const call = useSubCallPart();
  const output = useOutputPart();
  return <Part parts={[name, call, output]} />;
});

const TriggerEditor = memo(() => {
  const name = useGeneralPart();
  const call = useTriggerCallPart();
  const output = useOutputPart();
  return <Part parts={[name, call, output]} />;
});

export const workflowActivityEditors = new Map<ElementType, KnownEditor>([
  ['DialogCall', { editor: <DialogCallEditor />, icon: IvyIcons.UserDialog }],
  ['UserTask', { editor: <UserTaskEditor />, icon: IvyIcons.UserTask }],
  ['Script', { editor: <ScriptEditor />, icon: IvyIcons.Script }],
  ['EmbeddedProcessElement', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.SubActivities }],
  ['SubProcessCall', { editor: <SubProcessCallEditor />, icon: IvyIcons.SubActivities }],
  ['TriggerCall', { editor: <TriggerEditor />, icon: IvyIcons.Trigger }]
]);
