import type { StartCustomStartField } from '@axonivy/process-editor-inscription-protocol';
import { ComboboxUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import StartCustomFieldTable from './StartCustomFieldTable';

describe('StartCustomFieldTable', () => {
  const customFields: StartCustomStartField[] = [
    { name: 'field1', value: 'this is a string' },
    { name: 'number', value: '1' },
    { name: 'predefinedField0', value: 'predefinedValue0' }
  ];
  async function renderTable(action?: () => void): Promise<{
    data: () => StartCustomStartField[];
    rerender: () => void;
  }> {
    let data: StartCustomStartField[] = customFields;
    const view = customRender(<StartCustomFieldTable data={data} onChange={change => (data = change)} />, {
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
      rerender: () => view.rerender(<StartCustomFieldTable data={data} onChange={change => (data = change)} />)
    };
  }

  test('table will render', async () => {
    await renderTable();
    TableUtil.assertHeaders(['Name', 'Expression']);
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

  test('table can add/remove rows by keyboard', async () => {
    const view = await renderTable();
    await userEvent.click(screen.getAllByRole('row')[2]!);
    await TableUtil.assertAddRowWithKeyboard(view, 'predefinedField0', 'new');
    // data does not contain empty object
    expect(view.data()).toEqual([
      { name: 'field1', value: 'this is a string' },
      { name: 'number', value: '1' },
      { name: 'predefinedField0new', value: 'predefinedValue0' }
    ]);
  });

  test('table can edit cells', async () => {
    const view = await renderTable();
    await userEvent.click(screen.getAllByRole('row')[1]!);
    const field1 = screen.getAllByRole('combobox')[0]!;
    await userEvent.dblClick(field1);
    await userEvent.keyboard('Hello');
    await userEvent.tab();

    expect(view.data()).toEqual([
      { name: 'Hello', value: 'this is a string' },
      { name: 'number', value: '1' },
      { name: 'predefinedField0', value: 'predefinedValue0' }
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
