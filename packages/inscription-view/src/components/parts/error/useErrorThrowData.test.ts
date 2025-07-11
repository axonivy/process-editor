import type { ElementData, ErrorThrowData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { useErrorThrowData } from './useErrorThrowData';

describe('useErrorThrowData', () => {
  function renderDataHook(errorData: DeepPartial<ErrorThrowData>) {
    let data: DeepPartial<ElementData> = { name: 'test', config: errorData };
    const view = customRenderHook(() => useErrorThrowData(), { wrapperProps: { data, setData: newData => (data = newData) } });
    return { view, data: () => data };
  }

  test('in synch', () => {
    const { view, data } = renderDataHook({ throws: { error: 'test' } });

    view.result.current.updateThrows('error', 'myCoolName');
    view.result.current.update('code', 'test code');
    expect(data().config?.code).toEqual('test code');
  });

  test('not in synch', () => {
    const { view, data } = renderDataHook({ throws: { error: 'error' } });

    view.result.current.updateThrows('error', 'myCoolName');
    expect(data().name).toEqual('test');
  });
});
