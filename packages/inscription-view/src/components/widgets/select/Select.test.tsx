import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { SelectItem } from './Select';
import Select from './Select';

describe('Select', () => {
  const items: SelectItem[] = [
    { label: 'label', value: 'value' },
    { label: 'test', value: 'bla' }
  ];

  function renderSelect(): {
    data: () => SelectItem;
    rerender: () => void;
  } {
    let value = items[0];
    userEvent.setup();
    const view = customRender(<Select items={items} value={items[0]} onChange={(change: SelectItem) => (value = change)} />);
    return {
      data: () => value,
      rerender: () => view.rerender(<Select items={items} value={value} onChange={(change: SelectItem) => (value = change)} />)
    };
  }

  test('select will render', async () => {
    renderSelect();
    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('label');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.click(select);
    expect(select).toHaveTextContent('label');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'label' })).toHaveAttribute('data-state', 'checked');
    expect(screen.getByRole('option', { name: 'test' })).toHaveAttribute('data-state', 'unchecked');

    await userEvent.click(select, { pointerEventsCheck: 0 });
    expect(select).toHaveTextContent('label');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('select can change value', async () => {
    const view = renderSelect();
    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent(/label/);
    expect(view.data().value).toEqual('value');

    await userEvent.click(select);
    expect(screen.getAllByRole('option')).toHaveLength(2);
    await userEvent.click(screen.getByRole('option', { name: 'test' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    view.rerender();
    expect(select).toHaveTextContent(/test/);
    expect(view.data().value).toEqual('bla');
  });

  test('select can be handled with keyboard', async () => {
    const view = renderSelect();
    const select = screen.getByRole('combobox');
    await userEvent.keyboard('[Tab]');
    expect(select).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await userEvent.keyboard('[Enter]');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('[Enter]');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.keyboard('[Space]');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    const option1 = screen.getByRole('option', { name: 'label' });
    const option2 = screen.getByRole('option', { name: 'test' });
    expect(option1).toHaveAttribute('data-state', 'checked');
    expect(option2).toHaveAttribute('data-state', 'unchecked');
    await userEvent.keyboard('[ArrowDown]');
    expect(option1).toHaveAttribute('data-state', 'checked');
    expect(option2).toHaveAttribute('data-state', 'unchecked');

    await userEvent.keyboard('[Enter]');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    view.rerender();
    expect(select).toHaveTextContent(/test/);
    expect(view.data().value).toEqual('bla');
  });

  test('select support readonly mode', () => {
    customRender(<Select items={items} value={items[0]} onChange={() => {}} disabled={true} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  test('select support readonly mode', () => {
    customRender(<Select items={items} value={items[0]} onChange={() => {}} />, {
      wrapperProps: { editor: { readonly: true } }
    });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
