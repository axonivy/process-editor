import type { ProgramInterfaceStartData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useValidations } from '../../../../context/useValidation';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import JavaClassSelector from '../JavaClassSelector';
import { useProgramInterfaceData } from './useProgramInterfaceData';

export function useProgramInterfaceStartPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useProgramInterfaceData();
  const compareData = (data: ProgramInterfaceStartData) => [data.javaClass];
  const validation = useValidations(['javaClass']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Java Bean',
    name: t('part.program.start.title'),
    state,
    content: <ProgramInterfaceStartPart />,
    icon: IvyIcons.StartProgram
  };
}

const ProgramInterfaceStartPart = ({ thirdParty }: { thirdParty?: boolean }) => {
  const { config, update } = useProgramInterfaceData();

  return (
    <>
      {(thirdParty === undefined || thirdParty === false) && (
        <JavaClassSelector javaClass={config.javaClass} onChange={change => update('javaClass', change)} type='ACTIVITY' />
      )}
    </>
  );
};
