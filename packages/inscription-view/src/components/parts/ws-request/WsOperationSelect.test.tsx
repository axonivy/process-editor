import { EMPTY_VAR_INFO, type WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, SelectUtil } from 'test-utils';
import { describe, test } from 'vitest';
import { WsOperationSelect } from './WsOperationSelect';

describe('WsOperationSelect', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    customRender(<WsOperationSelect />, {
      wrapperProps: {
        data: data && { config: data },
        meta: {
          wsOperations: [
            { name: 'Super', parameter: EMPTY_VAR_INFO },
            { name: 'soaper', parameter: EMPTY_VAR_INFO }
          ]
        }
      }
    });
  }

  test('empty', async () => {
    renderPart();
    await SelectUtil.assertEmpty({ label: 'Operation' });
  });

  test('unknown', async () => {
    renderPart({ operation: { name: 'unknown' } });
    await SelectUtil.assertValue('unknown');
    await SelectUtil.assertOptionsCount(3);
  });

  test('data', async () => {
    renderPart({ operation: { name: 'name' } });
    await SelectUtil.assertValue('name');
    await SelectUtil.assertOptionsCount(3);
  });
});
