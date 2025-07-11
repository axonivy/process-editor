import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';
import { useProgramStartPart } from '../../parts/program/event/ProgramStartPart';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const ThirdPartyProgramStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useProgramStartPart({ thirdParty: true });
  const configuration = useConfigurationPart();
  return <Part parts={[name, start, configuration]} />;
});

export const thirdPartyStartEventEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyProgramStart', { editor: <ThirdPartyProgramStartEditor /> }]
]);
