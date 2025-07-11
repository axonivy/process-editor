import type { StartCustomStartField } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import StartCustomFieldTable from './StartCustomFieldTable';

describe('StartCustomFieldTable', () => {
  const customFields: StartCustomStartField[] = [
    { name: 'field1', value: 'this is a string' },
    { name: 'number', value: '1' }
  ];
  function renderTable(): {
    data: () => StartCustomStartField[];
    rerender: () => void;
  } {
    let data: StartCustomStartField[] = customFields;
    const view = customRender(<StartCustomFieldTable data={data} onChange={change => (data = change)} />);
    return {
      data: () => data,
      rerender: () => view.rerender(<StartCustomFieldTable data={data} onChange={change => (data = change)} />)
    };
  }

  test('table will render', () => {
    renderTable();
    TableUtil.assertHeaders(['Name', 'Expression']);
    TableUtil.assertRows([/field1/, /number/]);
  });

  test('table can sort columns', async () => {
    renderTable();
    await userEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));
    TableUtil.assertRows(['field1 this is a string', 'number 1']);

    await userEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));
    TableUtil.assertRows(['number 1', 'field1 this is a string']);
  });

  test('table can add new row', async () => {
    const view = renderTable();
    await TableUtil.assertAddRow(view, 3);
  });

  test('table can remove a row', async () => {
    const view = renderTable();
    await TableUtil.assertRemoveRow(view, 1);
  });

  test('table can add/remove rows by keyboard', async () => {
    const view = renderTable();
    await userEvent.click(screen.getAllByRole('row')[2]);
    await TableUtil.assertAddRowWithKeyboard(view, 'number', '1');
    // data does not contain empty object
    expect(view.data()).toEqual([
      { name: 'field1', value: 'this is a string' },
      { name: 'number1', value: '1' }
    ]);
  });

  test('table can edit cells', async () => {
    const view = renderTable();
    await userEvent.click(screen.getAllByRole('row')[1]);
    const field1 = screen.getAllByRole('combobox')[0];
    await userEvent.dblClick(field1);
    await userEvent.keyboard('Hello');
    await userEvent.tab();

    expect(view.data()).toEqual([
      { name: 'Hello', value: 'this is a string' },
      { name: 'number', value: '1' }
    ]);
  });

  test('table support readonly mode', async () => {
    customRender(<StartCustomFieldTable data={customFields} onChange={() => {}} />, {
      wrapperProps: { editor: { readonly: true } }
    });
    TableUtil.assertReadonly();
    expect(screen.getByDisplayValue(/field1/)).toBeDisabled();
    expect(screen.getByDisplayValue('1')).toBeDisabled();
  });
});
