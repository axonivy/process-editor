import type { RestRequestData, RestResource } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { ComboboxUtil, customRender, screen, waitFor } from 'test-utils';
import { RestContentType } from './RestContentType';
import { describe, test, expect } from 'vitest';

describe('RestContentType', () => {
  function renderPart(data?: DeepPartial<RestRequestData>, restResource?: DeepPartial<RestResource>) {
    customRender(<RestContentType />, {
      wrapperProps: { data: data && { config: data }, meta: { restContentTypes: ['test', 'other'], restResource } }
    });
  }

  test('hide', async () => {
    renderPart(undefined, { method: {} });
    await waitFor(() => expect(screen.queryByRole('combobox')).not.toBeInTheDocument());
  });

  test('show', async () => {
    renderPart({ body: { type: 'RAW' } }, { method: {} });
    await screen.findByRole('combobox');
  });

  test('empty', async () => {
    renderPart();
    await ComboboxUtil.assertValue('application/json');
    await ComboboxUtil.assertOptionsCount(2);
  });

  test('unknown value', async () => {
    renderPart({ body: { mediaType: 'unknown' } });
    await ComboboxUtil.assertValue('unknown');
  });

  test('known value', async () => {
    renderPart({ body: { mediaType: 'test' } });
    await ComboboxUtil.assertValue('test');
  });
});
