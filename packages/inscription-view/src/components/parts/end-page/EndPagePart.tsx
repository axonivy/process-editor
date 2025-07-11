import type { EndPageData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import InputWithBrowser from '../../../components/widgets/input/InputWithBrowser';
import { useAction } from '../../../context/useAction';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import type { FieldsetControl } from '../../widgets/fieldset/fieldset-control';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { useEndPageData } from './useEndPageData';

export function useEndPagePart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useEndPageData();
  const compareData = (data: EndPageData) => [data.page];
  const validations = useValidations(['page']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'End Page',
    name: t('part.endPage.title'),
    state,
    content: <EndPagePart />,
    icon: IvyIcons.EndPage
  };
}

const EndPagePart = () => {
  const { t } = useTranslation();
  const { config, update } = useEndPageData();
  const action = useAction('openEndPage');
  const openFile: FieldsetControl = { label: t('label.openFile'), icon: IvyIcons.GoToSource, action: () => action(config.page) };
  return (
    <PathCollapsible label={t('part.endPage.title')} controls={[openFile]} path='page' defaultOpen={true}>
      <ValidationFieldset>
        <InputWithBrowser browsers={['cms']} typeFilter={'FILE'} value={config.page} onChange={change => update('page', change)} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
