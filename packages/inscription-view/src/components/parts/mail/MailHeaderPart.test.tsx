import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useMailHeaderPart } from './MailHeaderPart';

const Part = () => {
  const part = useMailHeaderPart();
  return <>{part.content}</>;
};

describe('MailHeaderPart', () => {
  function renderPart(data?: DeepPartial<MailData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertPage(data?: DeepPartial<MailData>) {
    expect(screen.getByLabelText('Subject')).toHaveValue(data?.headers?.subject ?? '');
    expect(screen.getByLabelText('From')).toHaveValue(data?.headers?.from ?? '');
    expect(screen.getByLabelText('Reply to')).toHaveValue(data?.headers?.replyTo ?? '');
    expect(screen.getByLabelText('To')).toHaveValue(data?.headers?.to ?? '');
    expect(screen.getByLabelText('CC')).toHaveValue(data?.headers?.cc ?? '');
    expect(screen.getByLabelText('BCC')).toHaveValue(data?.headers?.bcc ?? '');
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Header');
  });

  test('full data', async () => {
    const data: DeepPartial<MailData> = {
      headers: { subject: 'sub', from: 'from', replyTo: 'reply', to: 'to', cc: 'cc', bcc: 'bcc' }
    };
    renderPart(data);
    await assertPage(data);
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<MailData>) {
    const { result } = customRenderHook(() => useMailHeaderPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { headers: { subject: 's' } });
    assertState('configured', { headers: { from: 's' } });
    assertState('configured', { headers: { to: 's' } });
    assertState('configured', { headers: { replyTo: 's' } });
    assertState('configured', { headers: { cc: 's' } });
    assertState('configured', { headers: { bcc: 's' } });
  });
});
