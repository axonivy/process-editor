import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useCasePart } from '../../parts/case/CasePart';
import { useEndPagePart } from '../../parts/end-page/EndPagePart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useOutputPart } from '../../parts/output/OutputPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';
import { useEventPart } from '../../parts/program/intermediate/EventPart';
import { useTaskPart } from '../../parts/task/TaskPart';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const TaskSwitchEventEditor = memo(() => {
  const name = useGeneralPart();
  const task = useTaskPart();
  const casePart = useCasePart();
  const endPage = useEndPagePart();
  const output = useOutputPart();
  return <Part parts={[name, task, casePart, endPage, output]} />;
});

const WaitEventEditor = memo(() => {
  const name = useGeneralPart();
  const event = useEventPart();
  const configuration = useConfigurationPart();
  const task = useTaskPart({ type: 'wait' });
  const output = useOutputPart();
  return <Part parts={[name, event, configuration, task, output]} />;
});

export const intermediateEventEditors = new Map<ElementType, KnownEditor>([
  ['TaskSwitchEvent', { editor: <TaskSwitchEventEditor />, icon: IvyIcons.Task }],
  ['WaitEvent', { editor: <WaitEventEditor />, icon: IvyIcons.ClockOutline }]
]);
