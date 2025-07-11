import type { ResultData, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen, TableUtil } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useResultPart } from './ResultPart';

const Part = () => {
  const part = useResultPart();
  return <>{part.content}</>;
};

describe('ResultPart', () => {
  function renderPart(data?: DeepPartial<ResultData>, outScripting?: VariableInfo) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data }, meta: { outScripting } } });
  }

  async function assertMainPart(params: RegExp[], map: RegExp[], code: string) {
    await CollapsableUtil.assertClosed('Result parameters');
    if (params.length === 0) {
      TableUtil.assertRows(map);
    } else {
      await CollapsableUtil.toggle('Result parameters');
      TableUtil.assertRows(params, 1);
      TableUtil.assertRows(map, 3);
    }
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Result parameters');
    await CollapsableUtil.assertOpen('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    renderPart(
      {
        result: { code: 'code', map: { key: 'value' }, params: [{ name: 'param', type: 'String', desc: 'desc' }] }
      },
      {
        types: { '<String param>': [{ attribute: 'param', description: 'desc', type: 'String', simpleType: 'String' }] },
        variables: [{ attribute: 'result', description: '', type: '<String param>', simpleType: '<>' }]
      }
    );
    await assertMainPart([/param String desc/], [/result/, /param/, /key value/], 'code');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ResultData>) {
    const { result } = customRenderHook(() => useResultPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { result: { code: 'code' } });
    assertState('configured', { result: { map: { key: 'value' } } });
    assertState('configured', { result: { params: [{ name: 'param', type: 'String', desc: 'desc' }] } });
  });
});
