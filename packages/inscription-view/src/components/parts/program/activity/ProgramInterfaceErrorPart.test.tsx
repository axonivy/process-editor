import type { ProgramInterfaceStartData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, SelectUtil, customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useProgramInterfaceErrorPart } from './ProgramInterfaceErrorPart';

const Part = () => {
  const part = useProgramInterfaceErrorPart();
  return <>{part.content}</>;
};

describe('ProgramInterfaceErrorPart', () => {
  function renderPart(data?: DeepPartial<ProgramInterfaceStartData>) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Error');
    await CollapsableUtil.assertClosed('Timeout');
  });

  test('full data', async () => {
    renderPart({
      exceptionHandler: '>> Ignore Exception',
      timeout: { seconds: '123', error: 'ivy:error:program:timeout' }
    });
    await SelectUtil.assertValue('>> Ignore Exception', { index: 0 });
    await CollapsableUtil.assertOpen('Timeout');
    expect(screen.getByLabelText('Seconds')).toHaveValue('123');
    await SelectUtil.assertValue('ivy:error:program:timeout', { index: 1 });
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ProgramInterfaceStartData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useProgramInterfaceErrorPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { exceptionHandler: '>> Ignore Exception' });
    assertState('configured', { timeout: { seconds: '123' } });

    assertState('warning', undefined, { path: 'exceptionHandler.error', message: '', severity: 'WARNING' });
    assertState('error', undefined, { path: 'timeout.cause', message: '', severity: 'ERROR' });
  });
});
