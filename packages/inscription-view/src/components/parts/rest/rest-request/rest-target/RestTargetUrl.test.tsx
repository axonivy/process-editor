import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { RestTargetUrl } from './RestTargetUrl';

describe('RestTargetUrl', () => {
  const REST_CLIENT_URI = 'http://127.0.0.1:8081/designer/{ivy.var.myVar}/v1';

  async function renderTargetUrl(data?: DeepPartial<RestRequestData>, restClientUri = `${REST_CLIENT_URI}/`) {
    customRender(<RestTargetUrl />, {
      wrapperProps: { data: data && { config: data }, meta: { restClientUri } }
    });
    await screen.findByText(/127.0.0.1:8081/);
  }

  test('empty', async () => {
    await renderTargetUrl({ target: { clientId: 'client' } });
    expect(screen.getByText(/127.0.0.1:8081/)).toHaveTextContent(REST_CLIENT_URI);
    expect(screen.getByText('{ivy.var.myVar}')).toBeVisible();
    expect(screen.queryByRole('button', { name: 'OpenAPI' })).not.toBeInTheDocument();
  });

  test('path', async () => {
    await renderTargetUrl({ target: { clientId: 'client', path: '/{path}/test123' } });
    expect(screen.getByText(/127.0.0.1:8081/)).toHaveTextContent('http://127.0.0.1:8081/designer/{ivy.var.myVar}/v1/{path}/test123');
    expect(screen.getByText('{path}')).toBeVisible();
  });

  test('path with slash between segmets', async () => {
    await renderTargetUrl({ target: { clientId: 'client', path: '{path}/test123' } }, REST_CLIENT_URI);
    expect(screen.getByText(/127.0.0.1:8081/)).toHaveTextContent('http://127.0.0.1:8081/designer/{ivy.var.myVar}/v1/{path}/test123');
  });

  test('query', async () => {
    await renderTargetUrl({ target: { clientId: 'client', path: '/{path}/test123', queryParams: { q1: 'bla', hi: '' } } });
    expect(screen.getByText(/127.0.0.1:8081/)).toHaveTextContent(
      'http://127.0.0.1:8081/designer/{ivy.var.myVar}/v1/{path}/test123?q1=bla&hi'
    );
    expect(screen.getByText('q1')).toBeVisible();
    expect(screen.getByText('bla')).toBeVisible();
    expect(screen.getByText('hi')).toBeVisible();
  });
});
