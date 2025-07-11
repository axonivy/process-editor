import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useCasePart } from '../../parts/case/CasePart';
import { useConditionPart } from '../../parts/condition/ConditionPart';
import { useEndPagePart } from '../../parts/end-page/EndPagePart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useOutputPart } from '../../parts/output/OutputPart';
import { useMultiTasksPart } from '../../parts/task/MultiTasksPart';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const AlternativeEditor = memo(() => {
  const name = useGeneralPart();
  const condition = useConditionPart();
  return <Part parts={[name, condition]} />;
});

const JoinEditor = memo(() => {
  const name = useGeneralPart();
  const output = useOutputPart();
  return <Part parts={[name, output]} />;
});

const SplitEditor = memo(() => {
  const name = useGeneralPart();
  const output = useOutputPart();
  return <Part parts={[name, output]} />;
});

const TaskSwitchGatewayEditor = memo(() => {
  const name = useGeneralPart();
  const multiTasks = useMultiTasksPart();
  const casePart = useCasePart();
  const endPage = useEndPagePart();
  const output = useOutputPart();
  return <Part parts={[name, multiTasks, casePart, endPage, output]} />;
});

export const gatewayEditors = new Map<ElementType, KnownEditor>([
  ['Alternative', { editor: <AlternativeEditor />, icon: IvyIcons.AlternativeGateways }],
  ['Join', { editor: <JoinEditor />, icon: IvyIcons.JoinGateways }],
  ['Split', { editor: <SplitEditor />, icon: IvyIcons.JoinGateways }],
  ['TaskSwitchGateway', { editor: <TaskSwitchGatewayEditor />, icon: IvyIcons.JoinTasksGateways }]
]);
