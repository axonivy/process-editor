import type { WfCustomField } from '@axonivy/process-editor-inscription-protocol';
import { ComboboxUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import CustomFieldTable from './CustomFieldTable';

describe('CustomFieldTable', () => {
  const customFields: WfCustomField[] = [
    { name: 'field1', type: 'STRING', value: 'this is a string' },
    { name: 'number', type: 'NUMBER', value: '1' },
    { name: 'predefinedField0', type: 'STRING', value: 'predefinedValue0' }
  ];
  async function renderTable(action?: () => void): Promise<{
    data: () => WfCustomField[];
    rerender: () => void;
  }> {
    let data: WfCustomField[] = customFields;
    const view = customRender(<CustomFieldTable data={data} onChange={change => (data = change)} type='CASE' />, {
      wrapperProps: {
        elementContext: { app: '', pid: '', project: 'baseProject' },
        action,
        meta: {
          customFields: [
            {
              name: 'predefinedField0',
              project: 'project0',
              type: 'STRING',
              value: 'predefinedValue0'
            },
            {
              name: 'predefinedField1',
              project: 'project1',
              type: 'STRING',
              value: 'predefinedValue1'
            }
          ]
        }
      }
    });

    // ensure meta data is loaded before testing
    // otherwise it causes a rerender resulting in unexpected test behavior
    await userEvent.click(screen.getByRole('cell', { name: 'field1' }));
    await ComboboxUtil.assertOptionsCount(1, { nth: 0 });
    await userEvent.click(screen.getByRole('columnheader', { name: 'Name' }));

    return {
      data: () => data,
      rerender: () => view.rerender(<CustomFieldTable data={data} onChange={change => (data = change)} type='CASE' />)
    };
  }

  test('table will render', async () => {
    await renderTable();
    TableUtil.assertHeaders(['Name', 'Type', 'Expression']);
    TableUtil.assertRows([/field1/, /number/, /predefinedField0/]);
  });

  test('table can sort columns', async () => {
    await renderTable();
    await userEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));
    TableUtil.assertRows(['field1 this is a string', 'number 1', 'predefinedField0 predefinedValue0']);

    await userEvent.click(screen.getByRole('button', { name: 'Sort by Name' }));
    TableUtil.assertRows(['predefinedField0 predefinedValue0', 'number 1', 'field1 this is a string']);
  });

  test('table can add new row', async () => {
    const view = await renderTable();
    await TableUtil.assertAddRow(view, 4);
  });

  test('table can remove a row', async () => {
    const view = await renderTable();
    await TableUtil.assertRemoveRow(view, 2);
  });

  test('table can add rows by keyboard', async () => {
    const view = await renderTable();
    await TableUtil.assertAddRowWithKeyboard(view, 'predefinedField0', 'new');
    // data does not contain empty object
    expect(view.data()).toEqual([
      { name: 'field1', type: 'STRING', value: 'this is a string' },
      { name: 'number', type: 'NUMBER', value: '1' },
      { name: 'predefinedField0new', type: 'STRING', value: 'predefinedValue0' }
    ]);
  });

  test('table can edit cells', async () => {
    const view = await renderTable();
    const field1 = screen.getByDisplayValue(/field1/);
    await userEvent.clear(field1);
    await userEvent.type(field1, 'Hello[Tab]');
    view.rerender();

    const type = screen.getAllByRole('combobox')[1]!;
    await userEvent.click(type);
    await userEvent.keyboard('[ArrowDown][Enter]');

    expect(view.data()).toEqual([
      { name: 'Hello', type: 'TEXT', value: 'this is a string' },
      { name: 'number', type: 'NUMBER', value: '1' },
      { name: 'predefinedField0', type: 'STRING', value: 'predefinedValue0' }
    ]);
  });

  test('table support readonly mode', async () => {
    customRender(<CustomFieldTable data={customFields} onChange={() => {}} type='CASE' />, {
      wrapperProps: { editor: { readonly: true } }
    });
    TableUtil.assertReadonly();
    expect(screen.getByDisplayValue(/field1/)).toBeDisabled();
    expect(screen.getAllByRole('combobox')[0]).toBeDisabled();
  });

  describe('openCustomField', () => {
    test('no selection', async () => {
      const action = vi.fn();
      await renderTable(action);
      await userEvent.click(screen.getByRole('button', { name: 'Open custom field configuration' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openCustomField',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: ''
      });
    });

    describe('selection', () => {
      test('not predefined', async () => {
        const action = vi.fn();
        await renderTable(action);
        await userEvent.click(screen.getByRole('cell', { name: 'field1' }));
        await userEvent.click(screen.getByRole('button', { name: 'Open custom field configuration' }));
        expect(action).toHaveBeenCalledWith({
          actionId: 'openCustomField',
          context: {
            app: '',
            pid: '',
            project: 'baseProject'
          },
          payload: ''
        });
      });

      test('predefined', async () => {
        const action = vi.fn();
        await renderTable(action);
        await userEvent.click(screen.getByRole('cell', { name: 'predefinedField0' }));
        await userEvent.click(screen.getByRole('button', { name: 'Open custom field configuration' }));
        expect(action).toHaveBeenCalledWith({
          actionId: 'openCustomField',
          context: {
            app: '',
            pid: '',
            project: 'baseProject'
          },
          payload: '{"project":"project0"}'
        });
      });
    });
  });
});
