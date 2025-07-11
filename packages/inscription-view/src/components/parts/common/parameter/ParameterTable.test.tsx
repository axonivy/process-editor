import type { ScriptVariable } from '@axonivy/process-editor-inscription-protocol';
import { CollapsableUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import ParameterTable from './ParameterTable';

describe('ParameterTable', () => {
  const customFields: ScriptVariable[] = [
    { name: 'field1', type: 'String', desc: 'this is a string' },
    { name: 'number', type: 'Number', desc: '1' }
  ];
  function renderTable(): {
    data: () => ScriptVariable[];
    rerender: () => void;
  } {
    let data: ScriptVariable[] = customFields;
    const view = customRender(<ParameterTable label='Input parameters' data={data} onChange={change => (data = change)} />);
    return {
      data: () => data,
      rerender: () => view.rerender(<ParameterTable label='Input parameters' data={data} onChange={change => (data = change)} />)
    };
  }

  test('table will render', async () => {
    renderTable();
    CollapsableUtil.assertClosed('Input parameters');
    await CollapsableUtil.toggle('Input parameters');
    TableUtil.assertHeaders(['Name', 'Type', 'Description']);
    TableUtil.assertRows([/field1/, /number/]);
  });

  test('table can sort columns', async () => {
    renderTable();
    CollapsableUtil.assertClosed('Input parameters');
    await CollapsableUtil.toggle('Input parameters');
    const columnHeader = screen.getByRole('button', { name: 'Sort by Name' });
    await userEvent.click(columnHeader);
    TableUtil.assertRows([/field1/, /number/]);

    await userEvent.click(columnHeader);
    TableUtil.assertRows([/number/, /field1/]);
  });

  test('table can add new row', async () => {
    const view = renderTable();
    await CollapsableUtil.toggle('Input parameters');
    await TableUtil.assertAddRow(view, 3);
  });

  test('table can remove a row', async () => {
    const view = renderTable();
    await CollapsableUtil.toggle('Input parameters');
    await TableUtil.assertRemoveRow(view, 1);
  });

  test('table can add rows by keyboard', async () => {
    const view = renderTable();
    await CollapsableUtil.toggle('Input parameters');
    await TableUtil.assertAddRowWithKeyboard(view, 'number');
    // data does not contain empty object
    expect(view.data()).toEqual([
      { name: 'field1', type: 'String', desc: 'this is a string' },
      { name: 'number', type: 'Number', desc: '1' }
    ]);
  });

  test('table can edit cells', async () => {
    const view = renderTable();
    await CollapsableUtil.toggle('Input parameters');
    const field1 = screen.getByDisplayValue(/field1/);
    await userEvent.clear(field1);
    await userEvent.type(field1, 'Hello[Tab]');

    expect(view.data()).toEqual([
      { name: 'Hello', type: 'String', desc: 'this is a string' },
      { name: 'number', type: 'Number', desc: '1' }
    ]);
  });

  test('table support readonly mode', async () => {
    customRender(<ParameterTable label='Input parameters' data={customFields} onChange={() => {}} />, {
      wrapperProps: { editor: { readonly: true } }
    });
    await CollapsableUtil.toggle('Input parameters');
    TableUtil.assertReadonly();
    expect(screen.getByDisplayValue(/field1/)).toBeDisabled();
  });

  test('table hide description column', async () => {
    customRender(<ParameterTable label='Input parameters' data={customFields} onChange={() => {}} hideDesc={true} />);
    await CollapsableUtil.toggle('Input parameters');
    TableUtil.assertHeaders(['Name', 'Type']);
  });
});
