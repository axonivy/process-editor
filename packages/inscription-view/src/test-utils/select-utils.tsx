/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { screen, userEvent, waitFor } from 'test-utils';
import { expect } from 'vitest';

type SelectUtilOptions = {
  label?: string;
  index?: number;
};

export namespace SelectUtil {
  export function select(options?: SelectUtilOptions) {
    if (options?.label) {
      return screen.getByRole('combobox', { name: options.label });
    }
    if (options?.index !== undefined) {
      return screen.getAllByRole('combobox')[options.index];
    }
    return screen.getByRole('combobox');
  }

  export async function assertEmpty(options?: SelectUtilOptions) {
    await assertValue('', options);
  }

  export async function assertValue(value: string, options?: SelectUtilOptions) {
    await waitFor(() => expect(select(options)).toHaveTextContent(value));
  }

  export async function assertOptionsCount(count: number, options?: SelectUtilOptions) {
    await userEvent.click(select(options)!);
    expect(screen.getAllByRole('option')).toHaveLength(count);
    await userEvent.keyboard('[Escape]');
  }
}
