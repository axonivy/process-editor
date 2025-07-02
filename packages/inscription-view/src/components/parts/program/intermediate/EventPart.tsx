import type { EventData, IntermediateEventTimeoutAction } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS, IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import { useEventData } from './useEventData';
import JavaClassSelector from '../JavaClassSelector';
import { deepEqual } from '../../../../utils/equals';
import { useValidations } from '../../../../context/useValidation';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { PathFieldset } from '../../common/path/PathFieldset';
import ExceptionSelect from '../../common/exception-handler/ExceptionSelect';
import Radio, { type RadioItemProps } from '../../../widgets/radio/Radio';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';

export function useEventPart(options?: { thirdParty?: boolean }): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useEventData();
  const compareData = (data: EventData) => [data.javaClass, data.eventId, data.timeout];
  const validation = [...useValidations(['timeout']), ...useValidations(['eventId']), ...useValidations(['javaClass'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Event',
    name: t('part.program.event.title'),
    state,
    content: <EventPart thirdParty={options?.thirdParty} />,
    icon: IvyIcons.Clock
  };
}

const useEventTypes = () => {
  const { t } = useTranslation();
  return useMemo<Array<RadioItemProps<IntermediateEventTimeoutAction>>>(
    () => [
      { label: t('part.program.event.type.nothing'), value: 'NOTHING' },
      { label: t('part.program.event.type.destroyTask'), value: 'DESTROY_TASK' },
      { label: t('part.program.event.type.continueWithoutEvent'), value: 'CONTINUE_WITHOUT_EVENT' }
    ],
    [t]
  );
};

const EventPart = ({ thirdParty }: { thirdParty?: boolean }) => {
  const { t } = useTranslation();
  const { config, defaultConfig, update, updateTimeout } = useEventData();
  const items = useEventTypes();
  return (
    <>
      {(thirdParty === undefined || thirdParty === false) && (
        <JavaClassSelector javaClass={config.javaClass} onChange={change => update('javaClass', change)} type='INTERMEDIATE' />
      )}

      <PathCollapsible label={t('part.program.event.id')} path='eventId' defaultOpen={true}>
        <ValidationFieldset>
          <ScriptInput
            value={config.eventId}
            onChange={change => update('eventId', change)}
            type={IVY_SCRIPT_TYPES.NUMBER}
            browsers={['attr', 'func', 'type']}
          />
        </ValidationFieldset>
      </PathCollapsible>

      <PathCollapsible label={t('label.expiry')} path='timeout' defaultOpen={!deepEqual(config.timeout, defaultConfig.timeout)}>
        <PathFieldset label={t('label.duration')} path='duration'>
          <ScriptInput
            value={config.timeout.duration}
            onChange={change => updateTimeout('duration', change)}
            type={IVY_SCRIPT_TYPES.DURATION}
            browsers={['attr', 'func', 'type']}
          />
        </PathFieldset>
        <PathFieldset label={t('label.error')} path='error'>
          <ExceptionSelect
            value={config.timeout.error}
            onChange={change => updateTimeout('error', change)}
            staticExceptions={[IVY_EXCEPTIONS.intermediate]}
          />
        </PathFieldset>

        <PathFieldset label={t('label.action')} path='action'>
          <Radio
            value={config.timeout.action}
            onChange={change => updateTimeout('action', change as IntermediateEventTimeoutAction)}
            items={items}
            orientation='vertical'
          />
        </PathFieldset>
      </PathCollapsible>
    </>
  );
};
