import type { RestRequestData, RestResource } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, SelectUtil, TableUtil, customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { RestParameters } from './RestParameters';

describe('RestParameters', () => {
  function renderParameters(data?: DeepPartial<RestRequestData>, restResource?: DeepPartial<RestResource>) {
    customRender(<RestParameters />, {
      wrapperProps: { data: data && { config: data }, meta: { restResource } }
    });
  }

  test('empty', async () => {
    renderParameters();
    await CollapsableUtil.assertClosed('Parameters');
  });

  test('data', async () => {
    renderParameters({ target: { queryParams: { queryParam: 'query' }, templateParams: { pathParam: 'path' } } });
    await CollapsableUtil.assertOpen('Parameters');
    TableUtil.assertRows(['pathParam path', 'queryParam query']);
    await SelectUtil.assertValue('Path', { index: 0 });
    await SelectUtil.assertOptionsCount(2, { index: 0 });
    expect(SelectUtil.select({ index: 0 })).not.toBeDisabled();
    await SelectUtil.assertValue('Query', { index: 1 });
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('pathParam');
    expect(screen.getAllByRole('textbox')[0]).not.toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Remove row' })[0]).not.toBeDisabled();
  });

  test('data - openapi', async () => {
    renderParameters(undefined, {
      pathParams: [{ name: 'pathParam', type: { fullQualifiedName: 'Number' }, doc: 'path param', required: true }],
      queryParams: [{ name: 'queryParam', type: { fullQualifiedName: 'String' }, doc: 'query param', required: false }]
    });
    await screen.findByText('Kind');
    TableUtil.assertRows(['pathParam', 'queryParam']);
    expect(SelectUtil.select({ index: 0 })).toBeDisabled();
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('pathParam');
    expect(screen.getAllByRole('textbox')[0]).toBeDisabled();
    await userEvent.click(screen.getAllByRole('textbox')[0]);
    expect(screen.queryAllByRole('button', { name: 'Remove row' })).toHaveLength(0);
  });
});
