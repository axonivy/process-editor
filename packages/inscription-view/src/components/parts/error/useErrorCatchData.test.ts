import type { ElementData, ErrorCatchData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { useErrorCatchData } from './useErrorCatchData';

describe('useErrorCatchData', () => {
  function renderDataHook(errorData: ErrorCatchData) {
    let data: DeepPartial<ElementData> = { name: 'test', config: errorData };
    const view = customRenderHook(() => useErrorCatchData(), { wrapperProps: { data, setData: newData => (data = newData) } });
    return { view, data: () => data };
  }

  test('in synch', () => {
    const { view, data } = renderDataHook({ errorCode: 'test' });

    view.result.current.updateError('myCoolName');
    expect(data().name).toEqual('myCoolName');
  });

  test('not in synch', () => {
    const { view, data } = renderDataHook({ errorCode: 'error' });

    view.result.current.updateError('myCoolName');
    expect(data().name).toEqual('test');
  });
});
