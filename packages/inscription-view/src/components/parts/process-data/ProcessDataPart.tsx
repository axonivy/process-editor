import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useProcessDataData } from './useProcessDataData';
import type { ProcessDataData } from '@axonivy/process-editor-inscription-protocol';
import type { DataClassItem } from './ClassSelectorPart';
import DataClassSelector from './ClassSelectorPart';
import { Message } from '@axonivy/ui-components';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { useTranslation } from 'react-i18next';

export function useProcessDataPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, reset } = useProcessDataData();
  const compareData = (data: ProcessDataData) => [data.data];
  const validations = useValidations(['data']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: t('part.processData.title'),
    state,
    reset: { dirty, action: () => reset() },
    content: <ProcessDataPart />
  };
}

const ProcessDataPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = useProcessDataData();
  const { context } = useEditorContext();
  const dataClasses = [
    ...useMeta('meta/scripting/dataClasses', context, []).data.map<DataClassItem>(dataClass => {
      return { ...dataClass, value: dataClass.fullQualifiedName };
    })
  ];

  return (
    <PathCollapsible label={t('part.processData.dataClass')} path='data' defaultOpen={config.data !== defaultConfig.data}>
      <ValidationFieldset>
        <DataClassSelector dataClass={config.data} onChange={change => update('data', change)} dataClasses={dataClasses} />
      </ValidationFieldset>
      <Message message={t('part.processData.dataClassMessage')} variant='warning' />
    </PathCollapsible>
  );
};
