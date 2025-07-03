import { useMemo } from 'react';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import type { CallData, VariableInfo, ProcessCallData } from '@axonivy/process-editor-inscription-protocol';
import CallMapping, { useCallPartValidation } from '../CallMapping';
import { useCallData, useProcessCallData } from '../useCallData';
import CallSelect from '../CallSelect';
import { IvyIcons } from '@axonivy/ui-icons';
import { useValidations } from '../../../../context/useValidation';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { useAction } from '../../../../context/useAction';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { useTranslation } from 'react-i18next';

export function useSubCallPart(): PartProps {
  const { t } = useTranslation();
  const callData = useCallData();
  const targetData = useProcessCallData();
  const compareData = (callData: CallData, targetData: ProcessCallData) => [callData.call, targetData.processCall];
  const subCallValidations = useValidations(['processCall']);
  const callValidations = useCallPartValidation();
  const state = usePartState(
    compareData(callData.defaultConfig, targetData.defaultConfig),
    compareData(callData.config, targetData.config),
    [...subCallValidations, ...callValidations]
  );
  return {
    id: 'Process',
    name: t('part.call.title'),
    state,
    content: <SubCallPart />,
    icon: IvyIcons.Process
  };
}

const SubCallPart = () => {
  const { t } = useTranslation();
  const { config, update } = useProcessCallData();

  const { context } = useEditorContext();
  const { data: startItems } = useMeta('meta/start/calls', context, []);

  const variableInfo = useMemo<VariableInfo>(
    () => startItems.find(start => start.id === config.processCall)?.callParameter ?? { variables: [], types: {} },
    [config.processCall, startItems]
  );

  const action = useAction('newProcess');
  const createProcess: FieldsetControl = { label: t('part.call.sub.create'), icon: IvyIcons.Plus, action: () => action() };
  return (
    <>
      <PathCollapsible label={t('part.call.processStart')} controls={[createProcess]} defaultOpen={true} path='processCall'>
        <ValidationFieldset>
          <CallSelect
            start={config.processCall}
            onChange={change => update('processCall', change)}
            starts={startItems}
            startIcon={IvyIcons.SubStart}
          />
        </ValidationFieldset>
      </PathCollapsible>
      <CallMapping variableInfo={variableInfo} />
    </>
  );
};
