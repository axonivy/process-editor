import type { CaseData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import CustomFieldTable from '../common/customfield/CustomFieldTable';
import Information from '../common/info/Information';
import { useCaseData } from './useCaseData';

export function useCasePart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useCaseData();
  const validaitons = useValidations(['case']);
  const compareData = (data: CaseData) => [data.case];
  const state = usePartState(compareData(defaultConfig), compareData(config), validaitons);
  return {
    id: 'Case',
    name: t('part.case.title'),
    state: state,
    content: <CasePart />,
    icon: IvyIcons.List
  };
}

const CasePart = () => {
  const { config, defaultConfig, update } = useCaseData();

  return (
    <PathContext path='case'>
      <Information config={config.case} defaultConfig={defaultConfig.case} update={update} />
      <CustomFieldTable data={config.case.customFields} onChange={change => update('customFields', change)} type='CASE' />
    </PathContext>
  );
};
