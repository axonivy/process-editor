import type { ProcessDataData } from '@axonivy/process-editor-inscription-protocol';
import { Message } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import type { DataClassItem } from './ClassSelectorPart';
import DataClassSelector from './ClassSelectorPart';
import { useProcessDataData } from './useProcessDataData';

export function useProcessDataPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useProcessDataData();
  const compareData = (data: ProcessDataData) => [data.data];
  const validations = useValidations(['data']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Process Data',
    name: t('part.processData.title'),
    state,
    content: <ProcessDataPart />,
    icon: IvyIcons.DatabaseLink
  };
}

const ProcessDataPart = () => {
  const { t } = useTranslation();
  const { config, update } = useProcessDataData();
  const { context } = useEditorContext();
  const dataClasses = [
    ...useMeta('meta/scripting/dataClasses', context, []).data.map<DataClassItem>(dataClass => {
      return { ...dataClass, value: dataClass.fullQualifiedName };
    })
  ];

  return (
    <PathCollapsible label={t('part.processData.dataClass')} path='data' defaultOpen={true}>
      <ValidationFieldset>
        <DataClassSelector dataClass={config.data} onChange={change => update('data', change)} dataClasses={dataClasses} />
      </ValidationFieldset>
      <Message message={t('part.processData.dataClassMessage')} variant='warning' />
    </PathCollapsible>
  );
};
