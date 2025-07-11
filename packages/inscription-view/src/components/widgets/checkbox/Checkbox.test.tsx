import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  function renderCheckbox(): {
    data: () => boolean;
    rerender: () => void;
  } {
    let value = false;
    userEvent.setup();
    const view = customRender(<Checkbox label='test checkbox' value={value} onChange={(change: boolean) => (value = change)} />);
    return {
      data: () => value,
      rerender: () => view.rerender(<Checkbox label='test checkbox' value={value} onChange={(change: boolean) => (value = change)} />)
    };
  }

  test('toggled by box', async () => {
    const view = renderCheckbox();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(view.data()).toBeFalsy();

    await userEvent.click(checkbox);
    view.rerender();
    expect(checkbox).toBeChecked();
    expect(view.data()).toBeTruthy();

    await userEvent.click(checkbox);
    view.rerender();
    expect(checkbox).not.toBeChecked();
    expect(view.data()).toBeFalsy();
  });

  test('toggled by label', async () => {
    const view = renderCheckbox();
    const label = screen.getByLabelText('test checkbox');
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await userEvent.click(label);
    view.rerender();
    expect(checkbox).toBeChecked();
  });

  test('toggled with keyboard', async () => {
    const view = renderCheckbox();
    const checkbox = screen.getByRole('checkbox');
    await userEvent.tab();
    expect(checkbox).toHaveFocus();
    expect(checkbox).not.toBeChecked();

    await userEvent.keyboard('[Space]');
    view.rerender();
    expect(checkbox).toBeChecked();

    await userEvent.keyboard('[Space]');
    view.rerender();
    expect(checkbox).not.toBeChecked();
  });

  test('readonly mode', () => {
    customRender(<Checkbox label='test checkbox' value={true} onChange={() => {}} />, { wrapperProps: { editor: { readonly: true } } });
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  test('disabled mode', () => {
    customRender(<Checkbox label='test checkbox' value={true} onChange={() => {}} disabled={true} />, {
      wrapperProps: { editor: { readonly: true } }
    });
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
