import type { CallData, ProcessCallData, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
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
import { useCallData, useProcessCallData } from '../useCallData';

export function useTriggerCallPart(): PartProps {
  const { t } = useTranslation();
  const callData = useCallData();
  const targetData = useProcessCallData();
  const compareData = (callData: CallData, targetData: ProcessCallData) => [callData.call, targetData.processCall];
  const triggerCallValidations = useValidations(['processCall']);
  const callValidations = useCallPartValidation();
  const state = usePartState(
    compareData(callData.defaultConfig, targetData.defaultConfig),
    compareData(callData.config, targetData.config),
    [...triggerCallValidations, ...callValidations]
  );
  return {
    id: 'Process',
    name: t('part.call.title'),
    state,
    content: <TriggerCallPart />,
    icon: IvyIcons.Process
  };
}

const TriggerCallPart = () => {
  const { t } = useTranslation();
  const { config, update } = useProcessCallData();

  const { context } = useEditorContext();
  const { data: startItems } = useMeta('meta/start/triggers', context, []);

  const variableInfo = useMemo<VariableInfo>(
    () => startItems.find(start => start.id === config.processCall)?.callParameter ?? { variables: [], types: {} },
    [config.processCall, startItems]
  );

  const action = useAction('newProcess');
  const createProcess: FieldsetControl = { label: t('part.call.trigger.create'), icon: IvyIcons.Plus, action: () => action() };
  return (
    <>
      <PathCollapsible label={t('part.call.processStart')} controls={[createProcess]} defaultOpen={true} path='processCall'>
        <ValidationFieldset>
          <CallSelect
            start={config.processCall}
            onChange={change => update('processCall', change)}
            starts={startItems}
            startIcon={IvyIcons.Start}
          />
        </ValidationFieldset>
      </PathCollapsible>
      <CallMapping variableInfo={variableInfo} />
    </>
  );
};
