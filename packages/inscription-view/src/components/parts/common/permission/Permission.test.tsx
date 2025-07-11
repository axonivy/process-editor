import { CollapsableUtil, SelectUtil, customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { Permission } from './Permission';

const defaultConfig = { anonymous: true, error: 'ivy:security:forbidden', roles: ['Everybody'] };

describe('Permission', () => {
  function renderPart(data: PermissionTestData) {
    customRender(
      <Permission
        anonymousFieldActive={data.anonymousFieldActive}
        config={{ anonymous: data.anonymous, error: data.error, roles: data.roles }}
        defaultConfig={defaultConfig}
        updatePermission={() => {}}
      />
    );
  }

  test('data', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: false,
      anonymous: true,
      error: 'bla error',
      roles: ['Test', 'Hero']
    };
    renderPart(data);
    await CollapsableUtil.assertOpen('Permission');
    const roles = screen.getAllByRole('gridcell');
    expect(roles).toHaveLength(2);
    expect(roles[0]).toHaveTextContent('Test');
    expect(roles[1]).toHaveTextContent('Hero');
    await SelectUtil.assertValue('bla error', { label: 'Violation error' });
    expect(screen.queryByText('Anonymous')).not.toBeInTheDocument();
  });

  test('closed if empty', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: false,
      anonymous: true,
      error: 'ivy:security:forbidden',
      roles: ['Everybody']
    };
    renderPart(data);
    await CollapsableUtil.assertClosed('Permission');
  });

  test('allowIsAvailable', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: true,
      anonymous: false,
      error: 'bla error',
      roles: ['Test']
    };
    renderPart(data);
    expect(screen.getByText('Allow anonymous')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
  });

  test('roleIsDisabled', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: true,
      anonymous: true,
      error: 'bla error',
      roles: ['Test']
    };
    renderPart(data);
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
  });
});

interface PermissionTestData {
  anonymousFieldActive: boolean;
  anonymous: boolean;
  error: string;
  roles: string[];
}
