import type { Document } from '@axonivy/process-editor-inscription-protocol';
import { CollapsableUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import DocumentTable from './DocumentTable';

describe('DocumentTable', () => {
  const documents: Document[] = [
    { name: 'Doc 1', url: 'axonivy.com' },
    { name: 'ivyTeam ❤️', url: 'ivyteam.ch' }
  ];
  function renderTable(): {
    data: () => Document[];
    rerender: () => void;
  } {
    let data: Document[] = [];
    const view = customRender(<DocumentTable data={documents} onChange={change => (data = change)} />);
    return {
      data: () => data,
      rerender: () => view.rerender(<DocumentTable data={data} onChange={change => (data = change)} />)
    };
  }

  test('table will render', async () => {
    renderTable();
    CollapsableUtil.assertOpen('Means / Documents');
    TableUtil.assertHeaders(['Name', 'URL']);
    TableUtil.assertRows([/Doc 1 axonivy.com/, /ivyTeam ❤️ ivyteam.ch/]);
  });

  test('table can sort columns', async () => {
    renderTable();
    const columnHeader = screen.getByRole('button', { name: 'Sort by Name' });
    await userEvent.click(columnHeader);
    TableUtil.assertRows([/Doc 1 axonivy.com/, /ivyTeam ❤️ ivyteam.ch/]);

    await userEvent.click(columnHeader);
    TableUtil.assertRows([/ivyTeam ❤️ ivyteam.ch/, /Doc 1 axonivy.com/]);
  });

  test('table can add new row', async () => {
    const view = renderTable();
    await TableUtil.assertAddRow(view, 3);
  });

  test('table can remove a row', async () => {
    const view = renderTable();
    await TableUtil.assertRemoveRow(view, 1);
  });

  test('table can add rows by keyboard', async () => {
    const view = renderTable();
    await TableUtil.assertAddRowWithKeyboard(view, 'ivyTeam ❤️');
    // data does not contain empty object
    expect(view.data()).toEqual([
      { name: 'Doc 1', url: 'axonivy.com' },
      { name: 'ivyTeam ❤️', url: 'ivyteam.ch' }
    ]);
  });

  test('table can edit cells', async () => {
    const view = renderTable();
    expect(screen.getAllByRole('row').length).toBe(3);
    const input = screen.getByDisplayValue(/Doc 1/);
    await userEvent.click(input);
    await userEvent.keyboard('0');
    await userEvent.tab();

    expect(view.data()).toEqual([
      { name: 'Doc 10', url: 'axonivy.com' },
      { name: 'ivyTeam ❤️', url: 'ivyteam.ch' }
    ]);
  });

  test('table support readonly mode', async () => {
    customRender(<DocumentTable data={documents} onChange={() => {}} />, {
      wrapperProps: { editor: { readonly: true } }
    });
    TableUtil.assertReadonly();
    expect(screen.getByDisplayValue(/Doc 1/)).toBeDisabled();
  });
});
