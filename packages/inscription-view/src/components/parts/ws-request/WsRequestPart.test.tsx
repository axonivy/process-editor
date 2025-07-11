import type { ValidationResult, WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useWsRequestPart } from './WsRequestPart';

const Part = () => {
  const part = useWsRequestPart();
  return <>{part.content}</>;
};

describe('WsRequestPart', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Web Service');
    await CollapsableUtil.assertClosed('Properties');
    await CollapsableUtil.assertClosed('Mapping');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WsRequestData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useWsRequestPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { clientId: 'asdf' });
    assertState('configured', { properties: { name: 'a' } });
    assertState('configured', { operation: { name: 'asdf' } });

    assertState('error', undefined, { path: 'clientId', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'properties.name', message: '', severity: 'WARNING' });
    assertState('warning', undefined, { path: 'operation.name', message: '', severity: 'WARNING' });
  });
});
