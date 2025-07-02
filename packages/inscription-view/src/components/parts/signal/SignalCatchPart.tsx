import { IvyIcons } from '@axonivy/ui-icons';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useSignalCatchData } from './useSignalCatchData';
import type { SignalCatchData } from '@axonivy/process-editor-inscription-protocol';
import { classifiedItemInfo } from '../../../utils/event-code-categorie';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { ClassifiedItem } from '../common/classification/ClassificationCombobox';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import ClassificationCombobox from '../common/classification/ClassificationCombobox';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { useTranslation } from 'react-i18next';

export function useSignalCatchPart(options?: { makroSupport?: boolean; withBrowser?: boolean }): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useSignalCatchData();
  const compareData = (data: SignalCatchData) => [data.signalCode, options?.makroSupport ? '' : data.attachToBusinessCase];
  const validations = useValidations(['signalCode']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Signal',
    name: t('part.signal.title'),
    state,
    content: <SignalCatchPart makroSupport={options?.makroSupport} withBrowser={options?.withBrowser} />,
    icon: IvyIcons.StartSignal
  };
}

const SignalCatchPart = ({ makroSupport, withBrowser }: { makroSupport?: boolean; withBrowser?: boolean }) => {
  const { t } = useTranslation();
  const { config, update, updateSignal } = useSignalCatchData();
  const { context } = useEditorContext();
  const signalCodes = [
    { value: '', label: t('part.signal.empty'), info: t('part.signal.emptyDesc') },
    ...useMeta('meta/workflow/signalCodes', { context, macro: !!makroSupport }, []).data.map<ClassifiedItem>(code => {
      return { ...code, value: code.eventCode, info: classifiedItemInfo(code) };
    })
  ];

  return (
    <PathCollapsible label={t('part.signal.code')} path='signalCode' defaultOpen={true}>
      <ValidationFieldset>
        <ClassificationCombobox
          value={config.signalCode}
          onChange={change => updateSignal(change)}
          data={signalCodes}
          icon={IvyIcons.StartSignal}
          withBrowser={withBrowser}
        />
      </ValidationFieldset>
      {!makroSupport && (
        <Checkbox
          label={t('part.signal.attachBusinessCase')}
          value={config.attachToBusinessCase}
          onChange={change => update('attachToBusinessCase', change)}
        />
      )}
    </PathCollapsible>
  );
};
