import type { ValidationResult, WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, SelectUtil } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useWsErrorPart } from './WsErrorPart';

const Part = () => {
  const part = useWsErrorPart();
  return <>{part.content}</>;
};

describe('WsResponsePart', () => {
  function renderPart(data?: DeepPartial<WsErrorData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Error');
  });

  test('data', async () => {
    renderPart({ exceptionHandler: 'ex' });
    await CollapsableUtil.assertOpen('Error');
    await SelectUtil.assertValue('ex');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WsErrorData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useWsErrorPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { exceptionHandler: 'ex' });

    assertState('error', undefined, { path: 'exceptionHandler', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'exceptionHandler', message: '', severity: 'WARNING' });
  });
});
