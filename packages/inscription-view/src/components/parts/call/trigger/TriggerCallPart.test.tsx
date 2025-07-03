import { useTriggerCallPart } from './TriggerCallPart';
import { customRender, screen, TableUtil, customRenderHook, CollapsableUtil } from 'test-utils';
import type { CallData, ProcessCallData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useTriggerCallPart();
  return <>{part.content}</>;
};

describe('TriggerCallPart', () => {
  function renderPart(data?: CallData & ProcessCallData) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(dialog: string, map: RegExp[], code: string) {
    expect(await screen.findByRole('combobox')).toHaveValue(dialog);
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Process start');
    await CollapsableUtil.assertOpen('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    renderPart({ processCall: 'trigger', call: { code: 'code', map: { key: 'value' } } });
    await assertMainPart('trigger', [/key value/], 'code');
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<CallData & ProcessCallData>) {
    const { result } = customRenderHook(() => useTriggerCallPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { processCall: 'trigger' });
    assertState('configured', { call: { code: 'code', map: {} } });
    assertState('configured', { call: { code: '', map: { key: 'value' } } });
  });
});
