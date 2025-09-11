import type { WfLevel, WfPriority, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { Field, Flex } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DataUpdater } from '../../../../types/lambda';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import type { SelectItem } from '../../../widgets/select/Select';
import Select from '../../../widgets/select/Select';
import './PrioritySelect.css';

export type PriorityUpdater = DataUpdater<WfTask['priority']>;

export type PrioritySelectProps = { priority?: WfPriority; updatePriority: PriorityUpdater };

const usePriorityItems = () => {
  const { t } = useTranslation();
  return useMemo<Array<SelectItem<WfLevel>>>(
    () => [
      { label: t('priority.low'), value: 'LOW' },
      { label: t('priority.normal'), value: 'NORMAL' },
      { label: t('priority.high'), value: 'HIGH' },
      { label: t('priority.exception'), value: 'EXCEPTION' },
      { label: t('priority.script'), value: 'SCRIPT' }
    ],
    [t]
  );
};

const PrioritySelect = ({ priority, updatePriority }: PrioritySelectProps) => {
  const priorityItems = usePriorityItems();
  const selectedLevel = useMemo(() => {
    const defaultPrio = priorityItems.find(e => e.value === 'NORMAL') ?? priorityItems[1];
    return priorityItems.find(e => e.value === (priority?.level as WfLevel)) ?? defaultPrio;
  }, [priority?.level, priorityItems]);

  return (
    <Flex direction='row' gap={2} className='priority-select'>
      <Select value={selectedLevel} onChange={item => updatePriority('level', item.value as WfLevel)} items={priorityItems} />
      {(selectedLevel?.value as WfLevel) === 'SCRIPT' && (
        <Field>
          <ScriptInput
            type={IVY_SCRIPT_TYPES.INT}
            value={priority?.script ?? ''}
            onChange={change => updatePriority('script', change)}
            browsers={['attr', 'func', 'type']}
          />
        </Field>
      )}
    </Flex>
  );
};

export default PrioritySelect;
