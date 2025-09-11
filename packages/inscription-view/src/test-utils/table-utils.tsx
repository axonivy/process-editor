/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { screen, userEvent, waitFor, within } from 'test-utils';
import { expect } from 'vitest';

export namespace TableUtil {
  export function assertHeaders(expectedHeaders: string[]) {
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(expectedHeaders.length);
    headers.forEach((header, index) => {
      expect(header).toHaveTextContent(expectedHeaders[index]!);
    });
  }

  export function assertRows(expectedRows: (RegExp | string)[], index?: number) {
    const tBody = screen.getAllByRole('rowgroup')[index ?? 1]!;
    if (expectedRows.length === 0) {
      expect(within(tBody).queryAllByRole('row')).toHaveLength(0);
    } else {
      const rows = within(tBody).getAllByRole('row');
      expect(rows).toHaveLength(expectedRows.length);
      rows.forEach((row, index) => {
        expect(row).toHaveAccessibleName(expectedRows[index]);
      });
    }
  }

  export async function assertRowCount(expectedRows: number): Promise<void> {
    return waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(expectedRows));
  }

  export async function assertAddRow(view: { data: () => unknown[]; rerender: () => void }, expectedRows: number): Promise<void> {
    await assertRowCount(expectedRows);
    const addButton = screen.getByRole('button', { name: 'Add row' });
    await userEvent.click(addButton);
    // data does not contain empty object
    expect(view.data()).toHaveLength(expectedRows - 1);

    view.rerender();
    await assertRowCount(expectedRows + 1);
  }

  export async function assertAddRowWithKeyboard(
    view: { data: () => unknown[]; rerender: () => void },
    firstCellOfLastRowValue: string,
    type?: string
  ): Promise<void> {
    const rowCount = screen.getAllByRole('row').length;
    const firstCellLastRow = screen.getByDisplayValue(firstCellOfLastRowValue);
    await userEvent.click(firstCellLastRow);
    expect(firstCellLastRow).toHaveFocus();
    if (type) {
      await userEvent.keyboard(type);
    }
    await userEvent.tab();
    view.rerender();
    await assertRowCount(rowCount + 1);
  }

  export async function assertRemoveRow(view: { data: () => unknown[]; rerender: () => void }, expectedRows: number): Promise<void> {
    await assertRowCount(expectedRows + 2);
    const firstRow = screen.getAllByRole('row')[1]!;
    await userEvent.click(firstRow);
    const removeButton = await screen.findByRole('button', { name: 'Remove row' });
    await userEvent.click(removeButton);
    expect(view.data()).toHaveLength(expectedRows);

    view.rerender();
    await assertRowCount(expectedRows + 1);
  }

  export function assertReadonly() {
    expect(screen.getByRole('button', { name: 'Add row' })).toBeDisabled();
  }
}
