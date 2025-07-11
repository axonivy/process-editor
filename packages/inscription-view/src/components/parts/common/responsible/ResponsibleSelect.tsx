import type { WfResponsible, WfResponsibleType, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { Field, Flex } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DataUpdater } from '../../../../types/lambda';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import type { SelectItem } from '../../../widgets/select/Select';
import Select from '../../../widgets/select/Select';
import MultipleRoleSelect from '../role/MultipleRoleSelect';

export type ResponsibleUpdater = DataUpdater<WfTask['responsible']>;

type ResponsibleProps = { responsible?: WfResponsible; updateResponsible: ResponsibleUpdater };
type ResponsibleMemberProps = ResponsibleProps & { selectedType?: WfResponsibleType };

const Responsible = ({ selectedType, ...props }: ResponsibleMemberProps) => {
  switch (selectedType) {
    case 'ROLES':
      return (
        <MultipleRoleSelect
          value={props.responsible?.roles ?? []}
          onChange={change => props.updateResponsible('roles', change)}
          defaultRoles={['Everybody']}
          showTaskRoles={true}
        />
      );
    case 'ROLE_FROM_ATTRIBUTE':
    case 'USER_FROM_ATTRIBUTE':
      return (
        <ScriptInput
          value={props.responsible?.script ?? ''}
          onChange={change => props.updateResponsible('script', change)}
          type={IVY_SCRIPT_TYPES.STRING}
          browsers={['attr', 'func', 'type']}
        />
      );
    case 'MEMBERS_FROM_ATTRIBUTE':
      return (
        <ScriptInput
          value={props.responsible?.script ?? ''}
          onChange={change => props.updateResponsible('script', change)}
          type={IVY_SCRIPT_TYPES.STRING_LIST}
          browsers={['attr', 'func', 'type']}
        />
      );
    case 'DELETE_TASK':
    default:
      return <></>;
  }
};

const useResponsibleItems = (optionFilter?: WfResponsibleType[]) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const items: Array<SelectItem<WfResponsibleType>> = [
      { label: t('responsible.roles'), value: 'ROLES' },
      { label: t('responsible.roleFromAttr'), value: 'ROLE_FROM_ATTRIBUTE' },
      { label: t('responsible.userFromAttr'), value: 'USER_FROM_ATTRIBUTE' },
      { label: t('responsible.memberFromAttr'), value: 'MEMBERS_FROM_ATTRIBUTE' },
      { label: t('responsible.delete'), value: 'DELETE_TASK' }
    ];
    return items.filter(responsible => !(optionFilter && optionFilter.includes(responsible.value)));
  }, [optionFilter, t]);
};

export type ResponsibleSelectProps = ResponsibleProps & {
  optionFilter?: WfResponsibleType[];
};

const ResponsibleSelect = ({ responsible, updateResponsible, optionFilter }: ResponsibleSelectProps) => {
  const items = useResponsibleItems(optionFilter);
  const selectedType = useMemo(() => {
    const defaultResp = items.find(r => r.value === 'ROLES') ?? items[0];
    return items.find(r => r.value === responsible?.type) ?? defaultResp;
  }, [responsible?.type, items]);

  return (
    <Flex direction='column' gap={2} className='responsible-select'>
      <Select items={items} value={selectedType} onChange={item => updateResponsible('type', item.value as WfResponsibleType)} />
      <Field>
        <Responsible
          responsible={responsible}
          updateResponsible={updateResponsible}
          selectedType={selectedType?.value as WfResponsibleType}
        />
      </Field>
    </Flex>
  );
};

export default ResponsibleSelect;
