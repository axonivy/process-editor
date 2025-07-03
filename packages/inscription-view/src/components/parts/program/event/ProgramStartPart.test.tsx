import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, SelectUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { ValidationResult, ProgramStartData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useProgramStartPart } from './ProgramStartPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useProgramStartPart();
  return <>{part.content}</>;
};

describe('StartPart', () => {
  function renderPart(data?: ProgramStartData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Permission');
    await CollapsableUtil.assertOpen('Java Class');
  });

  test('full data', async () => {
    renderPart({
      javaClass: 'Test',
      permission: {
        anonymous: false,
        error: '>> Ignore Exception',
        roles: ['SYSTEM']
      }
    });
    await ComboboxUtil.assertValue('Test', { nth: 0 });
    await CollapsableUtil.assertOpen('Permission');
    expect(screen.getByLabelText('Allow anonymous')).not.toBeChecked();
    const roles = screen.getAllByRole('gridcell');
    expect(roles).toHaveLength(1);
    expect(roles[0]).toHaveTextContent('SYSTEM');
    await SelectUtil.assertValue('>> Ignore Exception', { label: 'Violation error' });
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ProgramStartData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useProgramStartPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { javaClass: 'Bla' });
    assertState('configured', { permission: { anonymous: false } });
    assertState('error', undefined, { path: 'javaClass.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'javaClass.error', message: '', severity: 'WARNING' });
  });
});
