import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook } from 'test-utils';
import type { DbErrorData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { describe, test, expect } from 'vitest';
import { useDbErrorPart } from './DbErrorPart';

const Part = () => {
  const part = useDbErrorPart();
  return <>{part.content}</>;
};

describe('DbErrorPart', () => {
  function renderPart(data?: DeepPartial<DbErrorData>) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Error');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<DbErrorData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useDbErrorPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { exceptionHandler: 'bla' });

    assertState('error', undefined, { path: 'exceptionHandler', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'exceptionHandler', message: '', severity: 'WARNING' });
  });
});
