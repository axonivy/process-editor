import type { CaseData, WfCase } from '@axonivy/process-editor-inscription-protocol';
import { CollapsableUtil, customRender, customRenderHook, screen, TableUtil } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useCasePart } from './CasePart';

const Part = () => {
  const part = useCasePart();
  return <>{part.content}</>;
};

describe('CasePart', () => {
  function renderPart(data?: CaseData) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(name: string, description: string, category: string) {
    expect(await screen.findByLabelText('Name')).toHaveValue(name);
    expect(await screen.findByLabelText('Description')).toHaveValue(description);
    expect(await screen.findByLabelText('Category')).toHaveValue(category);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Name / Description');
    await CollapsableUtil.assertClosed('Custom Fields');
  });

  test('full data', async () => {
    const caseData: CaseData = {
      case: {
        name: 'name',
        description: 'description',
        category: 'category',
        customFields: [{ name: 'field', type: 'STRING', value: '123' }],
        attachToBusinessCase: true
      }
    };
    renderPart(caseData);
    await assertMainPart('name', 'description', 'category');
    await CollapsableUtil.assertOpen('Custom Fields');
    TableUtil.assertRows(['field 123']);
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<WfCase>) {
    const { result } = customRenderHook(() => useCasePart(), { wrapperProps: { data: data && { config: { case: data } } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { name: 'name' });
    assertState('configured', { description: 'des' });
    assertState('configured', { category: 'category' });
    assertState('configured', { customFields: [{ name: 'asfd', type: 'NUMBER', value: '123' }] });
  });
});
