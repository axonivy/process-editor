import type { TriggerData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';
import EmptyWidget from '../../widgets/empty/EmptyWidget';
import { PathFieldset } from '../common/path/PathFieldset';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { ResponsibleCollapsible } from '../common/responsible/ResponsiblePart';
import { useTriggerData } from './useTriggerData';

export function useTriggerPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useTriggerData();
  const responsibleVal = useValidations(['task', 'responsible']);
  const delayVal = useValidations(['task', 'delay']);
  const compareData = (data: TriggerData) => [data.triggerable, data.case.attachToBusinessCase, data.task?.responsible, data.task?.delay];
  const state = usePartState(compareData(defaultConfig), compareData(config), [...responsibleVal, ...delayVal]);
  return {
    id: 'Trigger',
    name: t('part.trigger.title'),
    state: state,
    content: <TriggerPart />,
    icon: IvyIcons.Trigger
  };
}

const TriggerPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update, updateResponsible, updateDelay, updateAttach } = useTriggerData();
  return (
    <>
      {defaultConfig.task ? (
        <>
          <Checkbox
            value={config.triggerable}
            onChange={change => update('triggerable', change)}
            label={t('part.trigger.startTriggerable')}
          />
          {config.triggerable && (
            <PathContext path='task'>
              <ResponsibleCollapsible
                responsible={config.task.responsible}
                defaultResponsible={defaultConfig.task.responsible}
                updateResponsible={updateResponsible}
                defaultOpen={true}
              />
              <ValidationCollapsible
                label={t('part.task.options')}
                defaultOpen={!config.case.attachToBusinessCase || config.task.delay.length > 0}
              >
                <Checkbox
                  value={config.case.attachToBusinessCase}
                  onChange={change => updateAttach(change)}
                  label={t('part.trigger.attachBusinessCase')}
                />
                <PathFieldset label={t('part.task.delay')} path='delay'>
                  <ScriptInput
                    value={config.task.delay}
                    onChange={change => updateDelay(change)}
                    type={IVY_SCRIPT_TYPES.DURATION}
                    browsers={['attr', 'func', 'type']}
                  />
                </PathFieldset>
              </ValidationCollapsible>
            </PathContext>
          )}
        </>
      ) : (
        <EmptyWidget message={t('part.task.noTaskMessage')} />
      )}
    </>
  );
};
