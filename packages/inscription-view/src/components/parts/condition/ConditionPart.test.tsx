import type { DeepPartial } from 'test-utils';
import { customRender, TableUtil, customRenderHook, screen, CollapsableUtil } from 'test-utils';
import type { ConditionData, ConnectorRef } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useConditionPart } from './ConditionPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useConditionPart();
  return <>{part.content}</>;
};

describe('ConditionPart', () => {
  function renderPart(data?: ConditionData) {
    const connectors: DeepPartial<ConnectorRef[]> = [];
    connectors.push({ pid: 'something-f1', target: { name: 'db', type: { id: 'Database' } }, source: { pid: '' } });
    connectors.push({ pid: 'something-f8', target: { name: 'end', type: { id: 'TaskEnd' } }, source: { pid: '' } });
    customRender(<Part />, { wrapperProps: { data: data && { config: data }, meta: { connectors } } });
  }

  async function assertMainPart(map: RegExp[]) {
    TableUtil.assertRows(map);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Condition');
  });

  test('full data', async () => {
    const conditions: ConditionData = {
      conditions: {
        f1: 'in.accepted == false',
        f6: 'false',
        f8: ''
      }
    };
    renderPart(conditions);

    expect(await screen.findByText(/db: Database/)).toBeInTheDocument();
    await assertMainPart([/db: Database in.accepted == false/, /⛔ f6 false/, /end: TaskEnd/]);
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<ConditionData>) {
    const { result } = customRenderHook(() => useConditionPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { conditions: { f1: 'false' } });
  });
});
