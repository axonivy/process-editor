import type { WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import ExceptionSelect from '../common/exception-handler/ExceptionSelect';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { useWsErrorData } from './useWsErrorData';

export function useWsErrorPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useWsErrorData();
  const validations = useValidations(['exceptionHandler']);
  const compareData = (data: WsErrorData) => [data];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Error',
    name: t('label.error'),
    state: state,
    content: <WsErrorPart />,
    icon: IvyIcons.Error
  };
}

const WsErrorPart = () => {
  const { t } = useTranslation();
  const { config, update } = useWsErrorData();
  return (
    <PathCollapsible label={t('label.error')} defaultOpen={true} path='exceptionHandler'>
      <ValidationFieldset>
        <ExceptionSelect
          value={config.exceptionHandler}
          onChange={change => update('exceptionHandler', change)}
          staticExceptions={[IVY_EXCEPTIONS.webservice, IVY_EXCEPTIONS.ignoreException]}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
