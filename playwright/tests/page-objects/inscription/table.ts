import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { ScriptCell } from './code-editor';
import { Combobox } from './combobox';
import { Select } from './select';

export class Table {
  private readonly rows: Locator;
  private readonly header: Locator;
  private readonly locator: Locator;

  constructor(
    readonly page: Page,
    parentLocator: Locator,
    readonly columns: ColumnType[],
    label?: string
  ) {
    if (label === undefined) {
      this.locator = parentLocator;
    } else {
      this.locator = parentLocator.getByLabel(label);
    }
    this.rows = this.locator.locator('tbody tr:not(.ui-message-row)');
    this.header = this.locator.locator('thead tr');
  }

  async addRow() {
    const totalRows = await this.rows.count();
    await this.locator.getByRole('button', { name: 'Add row' }).click();
    return this.row(totalRows);
  }

  row(row: number) {
    return new Row(this.page, this.rows, this.header, row, this.columns);
  }

  cell(row: number, column: number) {
    return this.row(row).column(column);
  }

  async clear() {
    let totalRows = await this.rows.count();
    while (totalRows > 0) {
      await this.row(totalRows - 1).remove();
      await expect(this.rows).toHaveCount(totalRows - 1);
      totalRows = await this.rows.count();
    }
  }

  async expectEmpty() {
    await this.expectRowCount(0);
  }

  async expectRowCount(rows: number) {
    await expect(this.rows).toHaveCount(rows);
  }
}

export type ColumnType = 'label' | 'text' | 'expression' | 'select' | 'combobox';

export class Row {
  public readonly locator: Locator;
  public readonly header: Locator;

  constructor(
    readonly page: Page,
    rowsLocator: Locator,
    headerLocator: Locator,
    row: number,
    readonly columns: ColumnType[]
  ) {
    this.locator = rowsLocator.nth(row);
    this.header = headerLocator.nth(0);
  }

  async fill(values: string[]) {
    let value = 0;
    for (let column = 0; column < this.columns.length; column++) {
      if (this.columns[column] !== 'label') {
        const cell = this.column(column);
        await cell.fill(values[value++]);
      }
    }
  }

  column(column: number) {
    return new Cell(this.page, this.locator, column, this.columns[column]);
  }

  async expectValues(values: string[]) {
    let value = 0;
    for (let column = 0; column < this.columns.length; column++) {
      if (this.columns[column] !== 'label') {
        const cell = this.column(column);
        await cell.expectValue(values[value++]);
      }
    }
  }

  async remove(withoutHeader?: boolean) {
    await this.locator.click();
    await this.page.keyboard.press('Escape');
    await this.page.getByRole('button', { name: 'Remove row' }).click();
    if (!withoutHeader || withoutHeader === undefined) {
      await this.header.click();
    }
  }

  async dragTo(targetRow: Row) {
    const source = this.locator.locator('.ui-dnd-row-handleicon');
    const target = targetRow.locator.locator('.ui-dnd-row-handleicon');
    await source.dragTo(target);
  }
}

export class Cell {
  private readonly locator: Locator;
  private readonly textbox: Locator;
  private readonly select: Select;
  private readonly combobox: Combobox;

  constructor(
    readonly page: Page,
    rowLocator: Locator,
    column: number,
    readonly columnType: ColumnType
  ) {
    this.locator = rowLocator.getByRole('cell').nth(column);
    this.textbox = this.locator.getByRole('textbox');
    this.select = new Select(page, this.locator);
    this.combobox = new Combobox(page, this.locator);
  }

  async fill(value: string) {
    switch (this.columnType) {
      case 'label':
        throw new Error('This column is not editable');
      case 'text':
        await this.fillText(value);
        break;
      case 'expression':
        await this.fillExpression(value);
        break;
      case 'select':
        await this.select.choose(value);
        break;
      case 'combobox':
        await this.combobox.fill(value);
        break;
    }
  }

  async expectValue(value: string) {
    switch (this.columnType) {
      case 'select':
        await this.select.expectValue(value);
        break;
      case 'combobox':
        await this.combobox.expectValue(value);
        break;
      default:
        await expect(this.textbox).toHaveValue(value);
    }
  }

  async expectEmpty() {
    await expect(this.textbox).toBeEmpty();
  }

  private async fillText(value: string) {
    const input = this.textbox;
    await input.fill(value);
    await input.blur();
  }

  private async fillExpression(value: string) {
    const code = new ScriptCell(this.page, this.textbox, this.locator);
    await code.fill(value);
  }

  async focusScriptCell() {
    const code = new ScriptCell(this.page, this.textbox, this.locator);
    await code.focus();
  }

  async clearExpression() {
    const code = new ScriptCell(this.page, this.textbox, this.locator);
    await code.clear();
  }
}
