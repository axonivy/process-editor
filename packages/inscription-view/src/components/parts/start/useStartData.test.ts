import type { ElementData, StartData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { useStartData } from './useStartData';

describe('useStartData', () => {
  function renderDataHook(startData: StartData, options?: { name?: string; synchParams?: boolean }) {
    let data: DeepPartial<ElementData> = { name: options?.name ?? 'test()', config: startData };
    const view = customRenderHook(() => useStartData(options?.synchParams), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    return { view, data: () => data };
  }

  test('in synch', () => {
    const startData: StartData = { signature: 'test', input: { params: [], map: {}, code: '' } };
    const { view, data } = renderDataHook(startData, { synchParams: true });

    view.result.current.updateSignature('myCoolSignature');
    expect(data().name).toEqual('myCoolSignature()');
  });

  test('in synch with params', () => {
    const startData: StartData = { signature: 'test', input: { params: [], map: {}, code: '' } };
    const { view, data } = renderDataHook(startData, { synchParams: true });

    view.result.current.update('params', [{ name: '', type: 'String', desc: '' }]);
    expect(data().name).toEqual('test()');

    view.result.current.update('params', [
      { name: 'test', type: 'String', desc: '' },
      { name: 'list', type: 'java.util.List<Number>', desc: '' }
    ]);
    expect(data().name).toEqual('test(String,List<Number>)');
  });

  test('in synch with postfix', () => {
    const startData: StartData = { signature: 'test', input: { params: [], map: {}, code: '' } };
    const { view, data } = renderDataHook(startData, { name: 'test' });

    view.result.current.update('params', [
      { name: 'test', type: 'String', desc: '' },
      { name: 'list', type: 'List<Number>', desc: '' }
    ]);
    view.result.current.updateSignature('myCoolSignature');
    expect(data().name).toEqual('myCoolSignature');
  });
});
