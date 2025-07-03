import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useMailAttachmentPart } from './MailAttachmentPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useMailAttachmentPart();
  return <>{part.content}</>;
};

describe('MailAttachmentPart', () => {
  function renderPart(data?: DeepPartial<MailData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Attachments');
  });

  test('full data', async () => {
    const data: DeepPartial<MailData> = { attachments: ['a1', 'second'] };
    renderPart(data);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(2);
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<MailData>) {
    const { result } = customRenderHook(() => useMailAttachmentPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { attachments: ['s'] });
  });
});
