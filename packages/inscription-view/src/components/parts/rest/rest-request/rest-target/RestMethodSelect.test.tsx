import type { RestRequestData, RestResource } from '@axonivy/process-editor-inscription-protocol';
import { HTTP_METHOD } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { ComboboxUtil, SelectUtil, customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { OpenApiContextProvider } from '../../../../../context/useOpenApi';
import { RestMethodSelect } from './RestMethodSelect';

describe('RestMethodSelect', () => {
  function renderMethodSelect(data?: DeepPartial<RestRequestData>) {
    const restResources: DeepPartial<RestResource>[] = [
      { method: { httpMethod: 'GET' }, path: '/pet', doc: 'Get a random pet' },
      { method: { httpMethod: 'DELETE' }, path: '/pet/{petId}', doc: 'Delete a pet with given id' }
    ];
    customRender(
      <OpenApiContextProvider>
        <RestMethodSelect />
      </OpenApiContextProvider>,
      {
        wrapperProps: { data: data && { config: data }, meta: { restResources } }
      }
    );
  }

  test('empty', async () => {
    renderMethodSelect();
    expect(screen.getByRole('textbox')).toHaveValue('');
    await SelectUtil.assertValue('GET');
    await SelectUtil.assertOptionsCount(Object.keys(HTTP_METHOD).length);
  });

  test('empty - openapi', async () => {
    renderMethodSelect({ target: { clientId: 'client' } });
    await ComboboxUtil.assertValue('GET:');
  });

  test('data', async () => {
    renderMethodSelect({ target: { path: '/my/rest/api' }, method: 'DELETE' });
    expect(screen.getByRole('textbox')).toHaveValue('/my/rest/api');
    await SelectUtil.assertValue('DELETE');
  });

  test('data - openapi', async () => {
    renderMethodSelect({ target: { clientId: 'client', path: '/pet/{petId}' }, method: 'DELETE' });
    await ComboboxUtil.assertValue('DELETE:/pet/{petId}');
  });
});
