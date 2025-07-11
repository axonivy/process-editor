import type { RoleMeta, WfResponsible, WfResponsibleType } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen, SelectUtil } from 'test-utils';
import { describe, expect, test } from 'vitest';
import ResponsibleSelect from './ResponsibleSelect';

describe('ResponsibleSelect', () => {
  function renderSelect(options?: { type?: WfResponsibleType; script?: string; roles?: string[]; optionsFilter?: WfResponsibleType[] }) {
    const responsible: WfResponsible = {
      type: options?.type as WfResponsibleType,
      script: options?.script ?? '',
      roles: options?.roles ?? []
    };
    const roleTree: RoleMeta = {
      id: 'Everybody',
      label: 'In this role is everyone',
      children: [
        { id: 'Employee', label: '', children: [] },
        { id: 'Teamleader', label: '', children: [] }
      ]
    };
    const taskRoles: RoleMeta[] = [
      { id: 'CREATOR', label: 'CREATOR', children: [] },
      { id: 'SYSTEM', label: 'SYSTEM', children: [] }
    ];
    customRender(<ResponsibleSelect responsible={responsible} updateResponsible={() => {}} optionFilter={options?.optionsFilter} />, {
      wrapperProps: { meta: { roleTree, taskRoles } }
    });
  }

  test('all options', async () => {
    renderSelect({ type: 'ROLES', roles: ['bla'] });
    await SelectUtil.assertValue('Role', { index: 0 });
    await SelectUtil.assertOptionsCount(5, { index: 0 });
  });

  test('no delete option', async () => {
    renderSelect({ optionsFilter: ['DELETE_TASK'] });
    await SelectUtil.assertOptionsCount(4, { index: 0 });
  });

  test('select for role option', async () => {
    renderSelect({ type: 'ROLES', roles: ['Teamleader'] });
    const roles = screen.getAllByRole('gridcell');
    expect(roles).toHaveLength(1);
    expect(roles[0]).toHaveTextContent('Teamleader');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('input for role attr option', async () => {
    renderSelect({ type: 'ROLE_FROM_ATTRIBUTE', script: 'role responsible' });
    await SelectUtil.assertValue('Role from Attr', { index: 0 });
    expect(screen.getByRole('textbox')).toHaveValue('role responsible');
  });

  test('input for user attr option', async () => {
    renderSelect({ type: 'USER_FROM_ATTRIBUTE', script: 'user responsible' });
    await SelectUtil.assertValue('User from Attr', { index: 0 });
    expect(screen.getByRole('textbox')).toHaveValue('user responsible');
  });

  test('input for members attr option', async () => {
    renderSelect({ type: 'MEMBERS_FROM_ATTRIBUTE', script: 'members responsible' });
    await SelectUtil.assertValue('Members from Attr', { index: 0 });
    expect(screen.getByRole('textbox')).toHaveValue('members responsible');
  });

  test('nothing for delete option', async () => {
    renderSelect({ type: 'DELETE_TASK' });
    await SelectUtil.assertValue('Nobody & delete', { index: 0 });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
