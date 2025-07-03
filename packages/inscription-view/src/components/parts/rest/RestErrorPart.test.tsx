import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, CollapsableUtil, ComboboxUtil } from 'test-utils';
import type { ValidationResult, RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useRestErrorPart } from './RestErrorPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useRestErrorPart();
  return <>{part.content}</>;
};

describe('RestErrorPart', () => {
  function renderPart(data?: DeepPartial<RestResponseData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Error');
  });

  test('data', async () => {
    renderPart({ response: { clientError: 'client', statusError: 'status' } });
    await CollapsableUtil.assertOpen('Error');
    await ComboboxUtil.assertValue('client', { label: 'On Error (Connection, Timeout, etc.)' });
    await ComboboxUtil.assertValue('status', { label: 'On Status Code not successful (2xx)' });
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<RestResponseData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useRestErrorPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { response: { clientError: 'asdf' } });

    assertState('error', undefined, { path: 'response.statusError', message: '', severity: 'ERROR' });
  });
});
