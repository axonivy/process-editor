import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useOutputPart } from '../../parts/output/OutputPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';
import { useEventPart } from '../../parts/program/intermediate/EventPart';
import { useTaskPart } from '../../parts/task/TaskPart';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const ThirdPartyWaitEventEditor = memo(() => {
  const name = useGeneralPart();
  const event = useEventPart({ thirdParty: true });
  const configuration = useConfigurationPart();
  const task = useTaskPart({ type: 'wait' });
  const output = useOutputPart();
  return <Part parts={[name, event, configuration, task, output]} />;
});

export const thirdPartyIntermediateEventEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyWaitEvent', { editor: <ThirdPartyWaitEventEditor /> }]
]);
