import './ResponsibleSelect.css';
import { useMemo } from 'react';
import type { WfResponsible, WfResponsibleType, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { RESPONSIBLE_TYPE, IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import type { DataUpdater } from '../../../../types/lambda';
import RoleSelect from './RoleSelect';
import { Field, Flex } from '@axonivy/ui-components';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import type { SelectItem } from '../../../widgets/select/Select';
import Select from '../../../widgets/select/Select';

export type ResponsibleUpdater = DataUpdater<WfTask['responsible']>;

type ResponsibleProps = { responsible?: WfResponsible; updateResponsible: ResponsibleUpdater };
type ActivatorProps = ResponsibleProps & { selectedType?: WfResponsibleType };

const ResponsibleActivator = ({ selectedType, ...props }: ActivatorProps) => {
  switch (selectedType) {
    case 'ROLE':
      return (
        <RoleSelect
          value={props.responsible?.activator}
          onChange={change => props.updateResponsible('activator', change)}
          showTaskRoles={true}
        />
      );
    case 'ROLE_FROM_ATTRIBUTE':
    case 'USER_FROM_ATTRIBUTE':
      return (
        <ScriptInput
          aria-label='activator'
          value={props.responsible?.activator ?? ''}
          onChange={change => props.updateResponsible('activator', change)}
          type={IVY_SCRIPT_TYPES.STRING}
          browsers={['attr', 'func', 'type']}
        />
      );
    case 'MEMBERS_FROM_ATTRIBUTE':
      return (
        <ScriptInput
          aria-label='activator'
          value={props.responsible?.activator ?? ''}
          onChange={change => props.updateResponsible('activator', change)}
          type={IVY_SCRIPT_TYPES.STRING_LIST}
          browsers={['attr', 'func', 'type']}
        />
      );
    case 'DELETE_TASK':
    default:
      return <></>;
  }
};

const DEFAULT_RESPONSIBLE_TYPE: SelectItem & { value: WfResponsibleType } = { label: 'Role', value: 'ROLE' };

export type ResponsibleSelectProps = ResponsibleProps & {
  optionFilter?: WfResponsibleType[];
};

const ResponsibleSelect = ({ responsible, updateResponsible, optionFilter }: ResponsibleSelectProps) => {
  const typeItems = useMemo<SelectItem[]>(
    () =>
      Object.entries(RESPONSIBLE_TYPE)
        .filter(([value]) => !(optionFilter && optionFilter.includes(value as WfResponsibleType)))
        .map(([value, label]) => ({ label, value })),
    [optionFilter]
  );
  const selectedType = useMemo<SelectItem>(
    () => typeItems.find(e => e.value === responsible?.type) ?? DEFAULT_RESPONSIBLE_TYPE,
    [responsible?.type, typeItems]
  );

  return (
    <Flex direction='row' gap={2} className='responsible-select'>
      <Select items={typeItems} value={selectedType} onChange={item => updateResponsible('type', item.value as WfResponsibleType)} />
      <Field>
        <ResponsibleActivator
          responsible={responsible}
          updateResponsible={updateResponsible}
          selectedType={selectedType?.value as WfResponsibleType}
        />
      </Field>
    </Flex>
  );
};

export default ResponsibleSelect;
