import { SelectUtil, customRender } from 'test-utils';
import { DatabaseSelect } from './DatabaseSelect';
import { describe, test } from 'vitest';

describe('DatabaseSelect', () => {
  test('data', async () => {
    customRender(<DatabaseSelect />, {
      wrapperProps: { data: { config: { query: { dbName: 'test' } } }, meta: { databases: ['ivy', 'test', 'db'] } }
    });
    await SelectUtil.assertValue('test');
    await SelectUtil.assertOptionsCount(3);
  });
});
