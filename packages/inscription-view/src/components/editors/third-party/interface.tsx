import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useProgramInterfaceErrorPart } from '../../parts/program/activity/ProgramInterfaceErrorPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const ThirdPartyProgramInterfaceEditor = memo(() => {
  const name = useGeneralPart();
  const error = useProgramInterfaceErrorPart();
  const configuration = useConfigurationPart();
  return <Part parts={[name, error, configuration]} />;
});

export const thirdPartyInterfaceActivityEditors = new Map<ElementType, KnownEditor>([
  ['ThirdPartyProgramInterface', { editor: <ThirdPartyProgramInterfaceEditor /> }]
]);
