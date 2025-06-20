import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { EndPageData } from '@axonivy/process-editor-inscription-protocol';
import { useEndPagePart } from './EndPagePart';
import type { PartStateFlag } from '../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useEndPagePart();
  return <>{part.content}</>;
};

describe('EndPagePart', () => {
  function renderPart(data?: EndPageData) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertPage(page: string) {
    expect(screen.getByRole('textbox')).toHaveValue(page);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('End Page');
  });

  test('full data', async () => {
    renderPart({ page: 'layout/basic.xhtml' });
    await assertPage('layout/basic.xhtml');
  });

  function assertState(expectedState: PartStateFlag, data?: EndPageData) {
    const { result } = customRenderHook(() => useEndPagePart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { page: 'bla' });
  });
});
