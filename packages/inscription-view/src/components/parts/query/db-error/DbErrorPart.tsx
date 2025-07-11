import { IVY_EXCEPTIONS, type DbErrorData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { usePartState, type PartProps } from '../../../../components/editors/part/usePart';
import { useValidations } from '../../../../context/useValidation';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { useDbErrorData } from './useDbErrorData';

export function useDbErrorPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useDbErrorData();
  const exceptionVal = useValidations(['exceptionHandler']);
  const compareData = (data: DbErrorData) => [data];
  const state = usePartState(compareData(defaultConfig), compareData(config), exceptionVal);
  return {
    id: 'Error',
    name: t('label.error'),
    state: state,
    content: <QueryPart />,
    icon: IvyIcons.Error
  };
}

const QueryPart = () => {
  const { t } = useTranslation();
  const { config, updateException } = useDbErrorData();
  return (
    <PathCollapsible label={t('label.error')} defaultOpen={true} path='exceptionHandler'>
      <ValidationFieldset>
        <ExceptionSelect
          value={config.exceptionHandler}
          onChange={change => updateException(change)}
          staticExceptions={[IVY_EXCEPTIONS.database, IVY_EXCEPTIONS.ignoreException]}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
