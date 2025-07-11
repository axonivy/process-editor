import type { ProgramStartData } from '@axonivy/process-editor-inscription-protocol';
import { CollapsableUtil, SelectUtil, customRender } from 'test-utils';
import { describe, test } from 'vitest';
import JavaClassSelector from './JavaClassSelector';

describe('StartPart', () => {
  function renderPart(data?: Partial<ProgramStartData>) {
    customRender(<JavaClassSelector javaClass={data?.javaClass ?? ''} onChange={() => {}} type='START' />, {
      wrapperProps: {
        data: data && { config: data },
        meta: {
          javaClasses: [
            { fullQualifiedName: 'This is the full name', name: 'this is the name', packageName: 'coolpackage' },
            { fullQualifiedName: 'Amazing Fullname', name: 'Name is okay', packageName: 'Packagename' }
          ]
        }
      }
    });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Java Class');
  });

  test('meta', async () => {
    renderPart({ javaClass: 'bla' });
    await SelectUtil.assertEmpty();
    await SelectUtil.assertOptionsCount(2);
  });
});
