import { CollapsableUtil, customRender, customRenderHook, screen, TableUtil } from 'test-utils';
import type { GeneralData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useGeneralPart } from './GeneralPart';
import { describe, test, expect } from 'vitest';

const Part = (props: { hideTags?: boolean; disableName?: boolean }) => {
  const part = useGeneralPart({ hideTags: props.hideTags, disableName: props.disableName });
  return <>{part.content}</>;
};

describe('NamePart', () => {
  function renderPart(data?: Partial<GeneralData>, hideTags?: boolean, disableName?: boolean) {
    customRender(<Part hideTags={hideTags} disableName={disableName} />, { wrapperProps: { data } });
  }

  async function assertMainPart(name: string, description: string) {
    expect(await screen.findByLabelText('Display name')).toHaveValue(name);
    expect(await screen.findByLabelText('Description')).toHaveValue(description);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Name / Description');
    await CollapsableUtil.assertClosed('Means / Documents');
    await CollapsableUtil.assertClosed('Tags');
  });

  test('hide tags', async () => {
    renderPart(undefined, true);
    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  test('disable name', async () => {
    renderPart({ name: 'name' }, undefined, true);
    expect(await screen.findByLabelText('Display name')).toBeDisabled();
  });

  test('full data', async () => {
    renderPart({ name: 'name', description: 'description', docs: [{ name: 'doc', url: 'url' }], tags: ['tag1'] });
    await assertMainPart('name', 'description');
    TableUtil.assertRows(['doc url']);
    await CollapsableUtil.assertOpen('Tags');
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<GeneralData>) {
    const { result } = customRenderHook(() => useGeneralPart(), { wrapperProps: { data } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { name: 'name' });
    assertState('configured', { description: 'des' });
    assertState('configured', { docs: [{ name: 'a', url: 'u' }] });
    assertState('configured', { tags: ['demo'] });
  });
});
