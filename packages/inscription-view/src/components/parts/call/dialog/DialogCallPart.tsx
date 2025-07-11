import type { CallData, DialogCallData, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { useValidations } from '../../../../context/useValidation';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import CallMapping, { useCallPartValidation } from '../CallMapping';
import CallSelect from '../CallSelect';
import { useCallData, useDialogCallData } from '../useCallData';

export function useDialogCallPart(options?: { offline?: boolean }): PartProps {
  const { t } = useTranslation();
  const callData = useCallData();
  const targetData = useDialogCallData();
  const compareData = (callData: CallData, targetData: DialogCallData) => [callData.call, targetData.dialog];
  const dialogValidations = useValidations(['dialog']);
  const callValidations = useCallPartValidation();
  const state = usePartState(
    compareData(callData.defaultConfig, targetData.defaultConfig),
    compareData(callData.config, targetData.config),
    [...dialogValidations, ...callValidations]
  );
  return {
    id: 'Dialog',
    name: t('part.call.dialog.title'),
    state,
    content: <DialogCallPart offline={options?.offline} />,
    icon: IvyIcons.UserDialog
  };
}

const DialogCallPart = ({ offline }: { offline?: boolean }) => {
  const { t } = useTranslation();
  const { config, update } = useDialogCallData();

  const { context } = useEditorContext();
  const { data: startItems } = useMeta('meta/start/dialogs', { context, supportOffline: offline ?? false }, []);

  const variableInfo = useMemo<VariableInfo>(
    () => startItems.find(start => start.id === config.dialog)?.callParameter ?? { variables: [], types: {} },
    [config.dialog, startItems]
  );

  const action = useAction('newHtmlDialog');
  const createDialog: FieldsetControl = { label: t('part.call.dialog.create'), icon: IvyIcons.Plus, action: () => action() };
  return (
    <>
      <PathCollapsible label={t('part.call.dialog.title')} controls={[createDialog]} defaultOpen={true} path='dialog'>
        <ValidationFieldset>
          <CallSelect
            start={config.dialog}
            onChange={change => update('dialog', change)}
            starts={startItems}
            startIcon={IvyIcons.InitStart}
          />
        </ValidationFieldset>
      </PathCollapsible>
      <CallMapping variableInfo={variableInfo} />
    </>
  );
};
