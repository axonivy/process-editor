import type { ValidationResult, WebserviceStartData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useWebServicePart } from './WebServicePart';

const Part = () => {
  const part = useWebServicePart();
  return <>{part.content}</>;
};

describe('WebServicePart', () => {
  function renderPart(data?: WebserviceStartData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    expect(screen.getByText('Permission')).toBeInTheDocument();
    expect(screen.getByText('Exception')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WebserviceStartData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useWebServicePart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      permission: {
        error: '>> Ignore Exception'
      },
      exception: {
        condition: '0===0'
      }
    });

    assertState('error', undefined, { path: 'permission.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'exception.error', message: '', severity: 'WARNING' });
  });
});
