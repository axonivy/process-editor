import { useDialogCallPart } from './DialogCallPart';
import { customRender, screen, TableUtil, customRenderHook, CollapsableUtil } from 'test-utils';
import type { CallData, DialogCallData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useDialogCallPart();
  return <>{part.content}</>;
};

describe('DialogCallPart', () => {
  function renderPart(data?: CallData & DialogCallData) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(dialog: string, map: RegExp[], code: string) {
    expect(await screen.findByRole('combobox')).toHaveValue(dialog);
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Dialog');
    await CollapsableUtil.assertOpen('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    renderPart({ dialog: 'dialog', call: { code: 'code', map: { key: 'value' } } });
    await assertMainPart('dialog', [/key value/], 'code');
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<CallData & DialogCallData>) {
    const { result } = customRenderHook(() => useDialogCallPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { dialog: 'dialog' });
    assertState('configured', { call: { code: 'code', map: {} } });
    assertState('configured', { call: { code: '', map: { key: 'value' } } });
  });
});
