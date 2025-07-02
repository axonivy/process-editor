import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, customRender, customRenderHook } from 'test-utils';
import type { ErrorThrowData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useErrorThrowPart } from './ErrorThrowPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useErrorThrowPart();
  return <>{part.content}</>;
};

describe('ErrorThrowPart', () => {
  function renderPart(data?: ErrorThrowData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data }, meta: { eventCodes: [{ eventCode: 'test', process: '', project: '', usage: 1 }] } }
    });
  }

  async function assertMainPart(errorCode: string) {
    await ComboboxUtil.assertValue(errorCode, { label: 'Error Code to throw' });
    await ComboboxUtil.assertOptionsCount(1);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Error');
  });

  test('full data', async () => {
    renderPart({ throws: { error: 'test:code', cause: 'adsf' }, code: 'code' });
    await assertMainPart('test:code');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ErrorThrowData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useErrorThrowPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { throws: { error: 'error' } });
    assertState('configured', { throws: { cause: 'cause' } });

    assertState('error', undefined, { path: 'throws.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'throws.error', message: '', severity: 'WARNING' });
  });
});
