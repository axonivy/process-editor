import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import {
  BasicField,
  Button,
  Flex,
  Input,
  Message,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  toast
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { type Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useFunction } from '../../../context/useFunction';
import { useRoles } from '../../parts/common/role/useRoles';
import { isValidRowSelected, newNameExists, newNameIsValid } from './validate-role';

export const AddRolePopover = ({
  value,
  table,
  setAddedRoleName
}: {
  value: string;
  table: Table<RoleMeta>;
  setAddedRoleName: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { taskRoles } = useRoles();
  const [newRoleName, setNewRoleName] = useState('');

  const queryClient = useQueryClient();
  const { context } = useEditorContext();
  const addRole = useFunction(
    'meta/workflow/addRole',
    {
      context,
      newRole: { identifier: 'test', parent: 'Everybody' }
    },
    {
      onSuccess: () => {
        toast.info(t('browser.role.addSuccess'));
        queryClient.invalidateQueries({ queryKey: ['meta/workflow/roleTree', context] });
        setOpen(false);
      },
      onError: error => {
        toast.error(t('browser.role.addFailed'), { description: error.message });
      }
    }
  );

  return (
    <Popover
      open={open}
      onOpenChange={e => {
        setOpen(e);
        if (e) setNewRoleName('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          icon={IvyIcons.Plus}
          aria-label={t('browser.role.add', { role: value })}
          title={t('browser.role.add', { role: value })}
          disabled={!isValidRowSelected(table, taskRoles)}
        />
      </PopoverTrigger>
      <PopoverContent collisionPadding={5} style={{ zIndex: '10000' }}>
        <form onSubmit={event => event.preventDefault()}>
          <Flex direction='column' gap={2} alignItems='center'>
            <BasicField label={t('browser.role.newRole')} style={{ width: '100%' }}>
              <Input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} />
            </BasicField>
            {newNameExists(table, newRoleName) && <Message variant='error' message={t('browser.role.message.newRoleAlreadyExists')} />}
            <Button
              icon={IvyIcons.Plus}
              onClick={() => {
                addRole.mutate({
                  context,
                  newRole: { identifier: newRoleName, parent: value }
                });
                setAddedRoleName(newRoleName);
              }}
              aria-label={t('browser.role.add', { role: value })}
              title={t('browser.role.add', { role: value })}
              disabled={!newNameIsValid(table, newRoleName)}
              style={{ width: '100%' }}
              variant='primary'
              type='submit'
            >
              {t('browser.role.add', { role: value })}
            </Button>
          </Flex>
        </form>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};
