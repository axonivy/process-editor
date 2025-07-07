import { IvyIcons } from '@axonivy/ui-icons';
import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { type KnownEditor } from '../InscriptionEditor';

import Part from '../part/Part';
import { useCasePart } from '../../parts/case/CasePart';
import { useErrorCatchPart } from '../../parts/error/ErrorCatchPart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useOutputPart } from '../../parts/output/OutputPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';
import { useProgramStartPart } from '../../parts/program/event/ProgramStartPart';
import { useRequestPart } from '../../parts/request/RequestPart';
import { useSignalCatchPart } from '../../parts/signal/SignalCatchPart';
import { useStartPart } from '../../parts/start/StartPart';
import { useTaskPart } from '../../parts/task/TaskPart';
import { useTriggerPart } from '../../parts/trigger/TriggerPart';

const RequestStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ signatureDefaultOpen: true });
  const request = useRequestPart();
  const trigger = useTriggerPart();
  const task = useTaskPart({ type: 'request' });
  const casePart = useCasePart();
  return <Part parts={[name, start, request, trigger, task, casePart]} />;
});

const SignalStartEventEditor = memo(() => {
  const name = useGeneralPart();
  const signal = useSignalCatchPart();
  const output = useOutputPart();
  return <Part parts={[name, signal, output]} />;
});

const ErrorStartEventEditor = memo(() => {
  const name = useGeneralPart();
  const error = useErrorCatchPart();
  const output = useOutputPart();
  return <Part parts={[name, error, output]} />;
});

const ProgramStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useProgramStartPart();
  const configuration = useConfigurationPart();
  return <Part parts={[name, start, configuration]} />;
});

export const startEventEditors = new Map<ElementType, KnownEditor>([
  ['RequestStart', { editor: <RequestStartEditor />, icon: IvyIcons.Start }],
  ['SignalStartEvent', { editor: <SignalStartEventEditor />, icon: IvyIcons.StartSignalOutline }],
  ['ProgramStart', { editor: <ProgramStartEditor />, icon: IvyIcons.StartProgram }],
  ['ErrorStartEvent', { editor: <ErrorStartEventEditor />, icon: IvyIcons.ErrorStart }]
]);
