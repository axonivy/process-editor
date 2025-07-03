import { customRender, screen, TableUtil, customRenderHook, CollapsableUtil } from 'test-utils';
import { useOutputPart } from './OutputPart';
import type { PartStateFlag } from '../../editors/part/usePart';
import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { describe, test, expect } from 'vitest';

const Part = (props: { showSudo?: boolean }) => {
  const part = useOutputPart({ showSudo: props.showSudo });
  return <>{part.content}</>;
};

describe('OutputPart', () => {
  function renderPart(data?: Partial<OutputData>, showSudo?: boolean) {
    customRender(<Part showSudo={showSudo} />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(map: RegExp[], code: string) {
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    const data: Partial<OutputData> = { output: { map: { key: 'value' }, code: 'code' } };
    renderPart(data);
    await assertMainPart([/key value/], 'code');
  });

  test('enable Sudo', async () => {
    renderPart({ sudo: true }, true);
    await screen.findByLabelText(/Disable Permission/);
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<OutputData>, showSudo?: boolean) {
    const { result } = customRenderHook(() => useOutputPart({ showSudo }), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState(undefined, { sudo: false });
    assertState('configured', { output: { code: '', map: {} }, sudo: true });
    assertState('configured', { output: { code: 'code', map: {} } });
    assertState('configured', { output: { code: '', map: { key: 'value' } } });
  });
});
