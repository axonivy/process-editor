import type { ProgramStartData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useValidations } from '../../../../context/useValidation';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import { Permission } from '../../common/permission/Permission';
import JavaClassSelector from '../JavaClassSelector';
import { useProgramStartData } from './useProgramStartData';

export function useProgramStartPart(options?: { thirdParty?: boolean }): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useProgramStartData();
  const compareData = (data: ProgramStartData) => [data.javaClass, data.permission];
  const validation = useValidations(['javaClass']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Java Bean',
    name: t('part.program.start.title'),
    state,
    content: <ProgramStartPart thirdParty={options?.thirdParty} />,
    icon: IvyIcons.StartProgram
  };
}

const ProgramStartPart = ({ thirdParty }: { thirdParty?: boolean }) => {
  const { config, defaultConfig, update, updatePermission } = useProgramStartData();

  return (
    <>
      {(thirdParty === undefined || thirdParty === false) && (
        <JavaClassSelector javaClass={config.javaClass} onChange={change => update('javaClass', change)} type='START' />
      )}

      <Permission
        anonymousFieldActive={true}
        config={config.permission}
        defaultConfig={defaultConfig.permission}
        updatePermission={updatePermission}
      />
    </>
  );
};
