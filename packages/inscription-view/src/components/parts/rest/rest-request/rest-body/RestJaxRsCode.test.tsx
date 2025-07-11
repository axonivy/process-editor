import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { RestJaxRsCode } from './RestJaxRsCode';

describe('RestEntityTypeCombobox', () => {
  function renderPart(data?: DeepPartial<RestRequestData>) {
    customRender(<RestJaxRsCode />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    expect(screen.getByLabelText('JAX-RS')).toHaveValue('');
  });

  test('data', async () => {
    renderPart({ code: 'hi' });
    expect(screen.getByLabelText('JAX-RS')).toHaveValue('hi');
  });
});
