import type { ProgramInterfaceStartData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS, IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../../context/usePath';
import { useValidations } from '../../../../context/useValidation';
import { deepEqual } from '../../../../utils/equals';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useProgramInterfaceData } from './useProgramInterfaceData';

export function useProgramInterfaceErrorPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useProgramInterfaceData();
  const compareData = (data: ProgramInterfaceStartData) => [data.exceptionHandler, data.timeout];
  const validation = [...useValidations(['timeout']), ...useValidations(['exceptionHandler'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Error',
    name: t('part.program.error.title'),
    state,
    content: <ProgramInterfaceErrorPart />,
    icon: IvyIcons.Error
  };
}

const ProgramInterfaceErrorPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update, updateTimeout } = useProgramInterfaceData();

  return (
    <>
      <PathCollapsible label={t('part.program.error.title')} path='exceptionHandler' defaultOpen={true}>
        <PathContext path='error'>
          <ExceptionSelect
            value={config.exceptionHandler}
            onChange={change => update('exceptionHandler', change)}
            staticExceptions={[IVY_EXCEPTIONS.programException, IVY_EXCEPTIONS.ignoreException]}
          />
        </PathContext>
      </PathCollapsible>

      <PathCollapsible
        label={t('part.program.error.timout')}
        path='timeout'
        defaultOpen={!deepEqual(config.timeout, defaultConfig.timeout)}
      >
        <PathFieldset label={t('part.program.error.seconds')} path='seconds'>
          <ScriptInput
            value={config.timeout.seconds}
            onChange={change => updateTimeout('seconds', change)}
            type={IVY_SCRIPT_TYPES.DURATION}
            browsers={['attr', 'func', 'type']}
          />
        </PathFieldset>
        <PathFieldset label={t('part.program.error.title')} path='error'>
          <ExceptionSelect
            value={config.timeout.error}
            onChange={change => updateTimeout('error', change)}
            staticExceptions={[IVY_EXCEPTIONS.programTimeout, IVY_EXCEPTIONS.ignoreException]}
          />
        </PathFieldset>
      </PathCollapsible>
    </>
  );
};
