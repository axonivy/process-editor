import { EMPTY_VAR_INFO, type WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, TableUtil } from 'test-utils';
import { describe, test } from 'vitest';
import { WsMapping } from './WsMapping';

describe('WsMapping', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    customRender(<WsMapping />, {
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
    await CollapsableUtil.assertClosed('Mapping');
  });

  test('data', async () => {
    renderPart({ operation: { parameters: { name: 'value' } } });
    TableUtil.assertRows(['⛔ name value']);
  });
});
