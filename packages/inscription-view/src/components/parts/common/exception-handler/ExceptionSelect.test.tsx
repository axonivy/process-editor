import { customRender, SelectUtil } from 'test-utils';
import { describe, test } from 'vitest';
import ExceptionSelect from './ExceptionSelect';

describe('ExceptionSelect', () => {
  function renderSelect(options?: { error?: string }) {
    const expiryErrors = [
      { id: 'error1', label: 'this is error1' },
      { id: 'bla', label: 'blablabla' }
    ];
    customRender(<ExceptionSelect value={options?.error ?? ''} onChange={() => {}} staticExceptions={['test123']} />, {
      wrapperProps: { meta: { expiryErrors } }
    });
  }

  test('select will render', async () => {
    renderSelect();
    await SelectUtil.assertEmpty();
    await SelectUtil.assertOptionsCount(3);
  });

  test('select will render unknown value', async () => {
    renderSelect({ error: 'unknown' });
    await SelectUtil.assertValue('unknown');
  });

  test('select will render with given error', async () => {
    renderSelect({ error: 'error1' });
    await SelectUtil.assertValue('this is error1');
  });
});
