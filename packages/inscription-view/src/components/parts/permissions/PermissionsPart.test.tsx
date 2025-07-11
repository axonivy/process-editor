import type { PermissionsData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { usePermissionsPart } from './PermissionsPart';

const Part = () => {
  const part = usePermissionsPart();
  return <>{part.content}</>;
};

describe('PermissionsPart', () => {
  function renderPart(data?: PermissionsData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Permissions');
  });

  test('full data', async () => {
    renderPart({
      permissions: {
        view: { allowed: false }
      }
    });
    expect(screen.getByLabelText('Allow all workflow users to view the process on the Engine')).not.toBeChecked();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<PermissionsData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => usePermissionsPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      permissions: {
        view: { allowed: false }
      }
    });
  });
});
