import type { ErrorCatchData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useValidations } from '../../../context/useValidation';
import { classifiedItemInfo } from '../../../utils/event-code-categorie';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import type { ClassifiedItem } from '../common/classification/ClassificationCombobox';
import ClassificationCombobox from '../common/classification/ClassificationCombobox';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { useErrorCatchData } from './useErrorCatchData';

export function useErrorCatchPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useErrorCatchData();
  const compareData = (data: ErrorCatchData) => [data.errorCode];
  const validations = useValidations(['errorCode']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Error',
    name: t('part.error.title'),
    state,
    content: <ErrorCatchPart />,
    icon: IvyIcons.Error
  };
}

const ErrorCatchPart = () => {
  const { t } = useTranslation();
  const { config, updateError } = useErrorCatchData();
  const { context } = useEditorContext();
  const errorCodes = [
    { value: '', label: t('part.error.empty'), info: t('part.error.emptyDesc') },
    ...useMeta('meta/workflow/errorCodes', { context, thrower: false }, []).data.map<ClassifiedItem>(code => {
      return { ...code, value: code.eventCode, info: classifiedItemInfo(code) };
    })
  ];

  return (
    <PathCollapsible label={t('part.error.code')} path='errorCode' defaultOpen={true}>
      <ValidationFieldset>
        <ClassificationCombobox value={config.errorCode} onChange={change => updateError(change)} data={errorCodes} icon={IvyIcons.Error} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
