import type { RestRequestData, RestResource } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { TableUtil, customRender, screen, waitFor } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { RestForm } from './RestForm';

describe('RestForm', () => {
  function renderPart(data?: DeepPartial<RestRequestData>, restResource?: DeepPartial<RestResource>) {
    customRender(<RestForm />, { wrapperProps: { data: data && { config: data }, meta: { restResource } } });
  }

  test('empty', async () => {
    renderPart();
    TableUtil.assertRows([]);
  });

  test('data', async () => {
    renderPart({ body: { form: { bla: ['123'] } } });
    TableUtil.assertRows(['bla 123']);
  });

  test('openapi', async () => {
    renderPart(
      { body: { form: { test: ['123'] } } },
      {
        method: {
          inBody: { type: { name: 'para', properties: [{ name: 'test', type: { fullQualifiedName: 'Boolean' }, doc: 'test desc' }] } }
        }
      }
    );
    TableUtil.assertRows(['test 123']);
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('test');
    await waitFor(() => expect(screen.getAllByRole('textbox')[0]).toBeDisabled());
    expect(screen.getAllByRole('textbox')[0]).toBeDisabled();
    expect(screen.getAllByRole('textbox')[1]).toHaveValue('123');
    expect(screen.getAllByRole('textbox')[1]).toBeEnabled();
  });
});
