import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Checkbox from '../../widgets/checkbox/Checkbox';
import ExceptionSelect from '../common/exception-handler/ExceptionSelect';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useMailData } from './useMailData';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMailErrorPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useMailData();
  const compareData = (data: MailData) => [data.exceptionHandler, data.failIfMissingAttachments];
  const exceptionValidations = useValidations(['exceptionHandler']);
  const state = usePartState(compareData(defaultConfig), compareData(config), exceptionValidations);
  return {
    id: 'Error',
    name: t('part.error.title'),
    state,
    content: <MailErrorPart />,
    icon: IvyIcons.Error
  };
}

const MailErrorPart = () => {
  const { t } = useTranslation();
  const { config, update } = useMailData();

  return (
    <ValidationCollapsible label={t('part.error.title')} defaultOpen={true}>
      <PathContext path='exceptionHandler'>
        <ExceptionSelect
          value={config.exceptionHandler}
          onChange={change => update('exceptionHandler', change)}
          staticExceptions={[IVY_EXCEPTIONS.mail, IVY_EXCEPTIONS.ignoreException]}
        />
      </PathContext>
      <Checkbox
        label={t('part.mail.attachments.error')}
        value={config.failIfMissingAttachments}
        onChange={change => update('failIfMissingAttachments', change)}
      />
    </ValidationCollapsible>
  );
};
