import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { RestBodyRaw } from './RestBodyRaw';

describe('RestBodyRaw', () => {
  function renderPart(data?: DeepPartial<RestRequestData>) {
    customRender(<RestBodyRaw />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    expect(screen.getByTestId('code-editor')).toHaveValue('');
  });

  test('data', async () => {
    renderPart({ body: { raw: 'hi' } });
    expect(screen.getByTestId('code-editor')).toHaveValue('hi');
  });
});
