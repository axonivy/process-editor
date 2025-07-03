import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, SelectUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { MAIL_TYPE } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useMailMessagePart } from './MailMessagePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useMailMessagePart();
  return <>{part.content}</>;
};

describe('MailMessagePart', () => {
  function renderPart(data?: DeepPartial<MailData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertPage(data?: DeepPartial<MailData>) {
    expect(screen.getByLabelText('Message')).toHaveValue(data?.message?.body ?? '');
    await SelectUtil.assertValue(data?.message?.contentType ?? MAIL_TYPE.plain);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Content');
  });

  test('full data', async () => {
    const data: DeepPartial<MailData> = {
      message: { body: 'hello world', contentType: MAIL_TYPE.html }
    };
    renderPart(data);
    await assertPage(data);
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<MailData>) {
    const { result } = customRenderHook(() => useMailMessagePart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { message: { body: 'hi' } });
    assertState('configured', { message: { contentType: MAIL_TYPE.html } });
  });
});
