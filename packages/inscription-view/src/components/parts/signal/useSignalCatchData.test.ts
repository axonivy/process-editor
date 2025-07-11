import type { ElementData, SignalCatchData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { useSignalCatchData } from './useSignalCatchData';

describe('useSignalCatchData', () => {
  function renderDataHook(signalData: Partial<SignalCatchData>) {
    let data: DeepPartial<ElementData> = { name: 'test', config: signalData };
    const view = customRenderHook(() => useSignalCatchData(), { wrapperProps: { data, setData: newData => (data = newData) } });
    return { view, data: () => data };
  }

  test('in synch', () => {
    const { view, data } = renderDataHook({ signalCode: 'test' });

    view.result.current.updateSignal('myCoolName');
    expect(data().name).toEqual('myCoolName');
  });

  test('not in synch', () => {
    const { view, data } = renderDataHook({ signalCode: 'code' });

    view.result.current.updateSignal('myCoolName');
    expect(data().name).toEqual('test');
  });
});
