import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, screen, TableUtil, CollapsableUtil } from 'test-utils';
import type { ValidationResult, RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useRestOutputPart } from './RestOutputPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useRestOutputPart();
  return <>{part.content}</>;
};

describe('RestOutputPart', () => {
  function renderPart(data?: DeepPartial<RestResponseData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Result Type');
    await CollapsableUtil.assertClosed('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('data', async () => {
    renderPart({ response: { entity: { map: { bla: '123' }, code: 'code' } } });
    TableUtil.assertRows(['⛔ bla 123']);
    expect(screen.getByTestId('code-editor')).toHaveValue('code');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<RestResponseData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useRestOutputPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { response: { entity: { code: 'a' } } });

    assertState('error', undefined, { path: 'response.entity.code', message: '', severity: 'ERROR' });
  });
});
