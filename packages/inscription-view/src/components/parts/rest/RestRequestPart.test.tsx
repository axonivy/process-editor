import type { RestRequestData, RestResource, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useRestRequestPart } from './RestRequestPart';

const Part = () => {
  const part = useRestRequestPart();
  return <>{part.content}</>;
};

const Control = () => {
  const part = useRestRequestPart();
  return <>{part.control}</>;
};

describe('RestRequestPart', () => {
  function renderPart(data?: DeepPartial<RestRequestData>, restResources?: DeepPartial<RestResource[]>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data }, meta: { restResources } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Rest Service');
    await CollapsableUtil.assertClosed('Parameters');
    await CollapsableUtil.assertClosed('Headers');
    await CollapsableUtil.assertClosed('Properties');
  });

  test('post', async () => {
    renderPart({ method: 'POST' });
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.queryByText('JAX-RS')).not.toBeInTheDocument();
  });

  test('jax-rs', async () => {
    renderPart({ method: 'JAX_RS' });
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
    expect(screen.getByText('JAX-RS')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<RestRequestData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useRestRequestPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { code: 'code' });
    assertState('configured', { method: 'DELETE' });
    assertState('configured', { body: { mediaType: 'app/json' } });
    assertState('configured', { target: { clientId: 'client' } });

    assertState('error', undefined, { path: 'code', message: '', severity: 'ERROR' });
    assertState('error', undefined, { path: 'method', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'body.mediaType', message: '', severity: 'WARNING' });
    assertState('warning', undefined, { path: 'target.clientId', message: '', severity: 'WARNING' });
  });

  async function renderControl() {
    customRender(<Control />, { wrapperProps: { data: { config: { target: { clientId: 'client' } } }, meta: { restResources: [{}] } } });
    await screen.findByText('OpenAPI');
  }

  test('openapi', async () => {
    await renderControl();
    expect(screen.getByRole('switch', { name: 'OpenAPI' })).toBeInTheDocument();
  });
});
