import { useMemo } from 'react';
import { useRoles } from './useRoles';
import { Flex } from '@axonivy/ui-components';
import type { SelectItem } from '../../../widgets/select/Select';
import { useBrowser, type BrowserValue } from '../../../browser/useBrowser';
import { usePath } from '../../../../context/usePath';
import Select from '../../../widgets/select/Select';
import Browser from '../../../browser/Browser';

const DEFAULT_ROLE: SelectItem = { label: 'Everybody', value: 'Everybody' } as const;

type RoleSelectProps = {
  value?: string;
  onChange: (change: string) => void;
  showTaskRoles?: boolean;
};

const RoleSelect = ({ value, onChange, showTaskRoles }: RoleSelectProps) => {
  const { roles: roleItems } = useRoles(showTaskRoles);
  const browser = useBrowser();
  const path = usePath();
  const selectedRole = useMemo<SelectItem | undefined>(() => {
    if (value) {
      return roleItems.find(e => e.value === value) ?? { label: value, value };
    }
    return DEFAULT_ROLE;
  }, [value, roleItems]);

  return (
    <Flex direction='row' alignItems='center' gap={1} className='role-select'>
      <Select items={roleItems} value={selectedRole} onChange={item => onChange(item.value)} />
      <Browser
        {...browser}
        types={['role']}
        location={path}
        accept={(change: BrowserValue) => onChange(change.value)}
        roleOptions={{ showTaskRoles }}
      />
    </Flex>
  );
};

export default RoleSelect;
