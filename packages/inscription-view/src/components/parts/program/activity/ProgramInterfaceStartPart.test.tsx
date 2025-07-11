import type { ProgramInterfaceStartData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, customRender, customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useProgramInterfaceStartPart } from './ProgramInterfaceStartPart';

const Part = () => {
  const part = useProgramInterfaceStartPart();
  return <>{part.content}</>;
};

describe('ProgramInterfaceStartPart', () => {
  function renderPart(data?: DeepPartial<ProgramInterfaceStartData>) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Java Class');
  });

  test('full data', async () => {
    renderPart({
      javaClass: 'Test'
    });
    await ComboboxUtil.assertValue('Test', { nth: 0 });
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ProgramInterfaceStartData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useProgramInterfaceStartPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { javaClass: 'Bla' });

    assertState('error', undefined, { path: 'javaClass.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'javaClass.cause', message: '', severity: 'WARNING' });
  });
});
