import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, SelectUtil } from 'test-utils';
import { describe, test } from 'vitest';
import { WsPortSelect } from './WsPortSelect';

describe('WsPortSelect', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    customRender(<WsPortSelect />, { wrapperProps: { data: data && { config: data }, meta: { wsPorts: ['Super', 'soaper', '132'] } } });
  }

  test('empty', async () => {
    renderPart();
    await SelectUtil.assertEmpty({ label: 'Port' });
  });

  test('unknown', async () => {
    renderPart({ operation: { port: 'unknown' } });
    await SelectUtil.assertValue('unknown');
    await SelectUtil.assertOptionsCount(4);
  });

  test('data', async () => {
    renderPart({ operation: { port: 'name' } });
    await SelectUtil.assertValue('name');
    await SelectUtil.assertOptionsCount(4);
  });
});
