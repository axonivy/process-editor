/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { screen, userEvent, waitFor } from 'test-utils';
import { expect } from 'vitest';

type ComboboxUtilOptions = {
  label?: string;
  nth?: number;
};

export namespace ComboboxUtil {
  export function select(options?: ComboboxUtilOptions) {
    if (options?.label) {
      return screen.getByRole('combobox', { name: options.label });
    }
    if (options?.nth !== undefined) {
      return screen.getAllByRole('combobox')[options.nth];
    }
    return screen.getByRole('combobox');
  }

  export async function assertEmpty(options?: ComboboxUtilOptions) {
    await assertValue('', options);
  }

  export async function assertValue(value: string, options?: ComboboxUtilOptions) {
    await waitFor(() => expect(select(options)).toHaveValue(value));
  }

  export async function assertOptionsCount(count: number, options?: ComboboxUtilOptions) {
    await userEvent.click(select(options)!);
    expect(screen.getAllByRole('option')).toHaveLength(count);
  }
}
