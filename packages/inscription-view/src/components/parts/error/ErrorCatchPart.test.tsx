import { CollapsableUtil, ComboboxUtil, customRender, customRenderHook } from 'test-utils';
import type { ErrorCatchData } from '@axonivy/process-editor-inscription-protocol';
import { useErrorCatchPart } from './ErrorCatchPart';
import type { PartStateFlag } from '../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useErrorCatchPart();
  return <>{part.content}</>;
};

describe('ErrorCatchPart', () => {
  function renderPart(data?: ErrorCatchData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data }, meta: { eventCodes: [{ eventCode: 'test', process: '', project: '', usage: 1 }] } }
    });
  }

  async function assertMainPart(errorCode: string) {
    await ComboboxUtil.assertValue(errorCode, { nth: 0 });
    await ComboboxUtil.assertOptionsCount(2);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Error Code');
  });

  test('full data', async () => {
    renderPart({ errorCode: 'test:code' });
    await assertMainPart('test:code');
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<ErrorCatchData>) {
    const { result } = customRenderHook(() => useErrorCatchPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { errorCode: 'error' });
  });
});
