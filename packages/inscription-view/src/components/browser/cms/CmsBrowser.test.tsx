import { TableUtil, customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { BrowserValue } from '../useBrowser';
import { useCmsBrowser } from './CmsBrowser';

const Browser = (props: { location: string; accept: (value: BrowserValue) => void }) => {
  const browser = useCmsBrowser(
    () => {},
    props.location,
    () => {}
  );
  return (
    <>
      {browser.content}
      <button data-testid='accept' onClick={() => props.accept(browser.accept())} />
    </>
  );
};

describe('CmsBrowser', () => {
  function renderBrowser(options?: { location?: string; accept?: (value: BrowserValue) => void }) {
    customRender(<Browser location={options?.location ?? 'something'} accept={options?.accept ?? (() => {})} />, {
      wrapperProps: {
        meta: {
          contentObject: [
            {
              name: 'Macro',
              fullPath: '/Macro',
              type: 'STRING',
              values: {
                en: '<%=ivy.html.get("in.date")%> <%=ivy.cms.co("/ProcessPages/test/Panel1")%>'
              },
              children: []
            },
            {
              name: 'CoolFile',
              fullPath: '/CoolFile',
              type: 'FILE',
              values: {},
              children: []
            }
          ]
        }
      }
    });
  }

  test('render', async () => {
    renderBrowser();
    await TableUtil.assertRowCount(2);
  });

  test('accept', async () => {
    let data = '';
    renderBrowser({ accept: value => (data = value.value) });
    await userEvent.click(await screen.findByText('Macro'));
    await userEvent.click(screen.getByTestId('accept'));
    expect(data).toEqual('ivy.cms.co("/Macro")');
  });

  test('file', async () => {
    let data = '';
    renderBrowser({ accept: value => (data = value.value) });
    await userEvent.click(await screen.findByText('CoolFile'));
    await userEvent.click(screen.getByTestId('accept'));
    expect(data).toEqual('ivy.cms.cr("/CoolFile")');
  });

  test('file in mail attachments', async () => {
    let data = '';
    renderBrowser({ accept: value => (data = value.value), location: 'attachments' });
    await userEvent.click(await screen.findByText('CoolFile'));
    await userEvent.click(screen.getByTestId('accept'));
    expect(data).toEqual('ivy.cm.findObject("/CoolFile")');
  });
  test('file in mail content', async () => {
    let data = '';
    renderBrowser({ accept: value => (data = value.value), location: 'message' });
    await userEvent.click(await screen.findByText('CoolFile'));
    await userEvent.click(screen.getByTestId('accept'));
    expect(data).toEqual('ivy.cms.co("/CoolFile")');
  });
});
