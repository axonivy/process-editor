import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { RadioItemProps } from './Radio';
import Radio from './Radio';

describe('Radio', () => {
  const items: RadioItemProps<string>[] = [
    { label: 'Test', value: 'test' },
    { label: 'Second', value: 'second', description: 'description' }
  ];

  function renderRadio(): {
    data: () => string;
    rerender: () => void;
  } {
    let value = items[0].value;
    userEvent.setup();
    const view = customRender(<Radio items={items} value={items[0].value} onChange={change => (value = change)} />);
    return {
      data: () => value,
      rerender: () => view.rerender(<Radio items={items} value={value} onChange={change => (value = change)} />)
    };
  }

  test('render', async () => {
    renderRadio();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByRole('radio', { name: 'Test' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Second' })).not.toBeChecked();
  });

  test('change value', async () => {
    const view = renderRadio();
    await userEvent.click(screen.getByRole('radio', { name: 'Second' }));

    view.rerender();
    expect(screen.getByRole('radio', { name: 'Test' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Second' })).toBeChecked();
    expect(view.data()).toEqual('second');
  });

  test('readonly mode', () => {
    customRender(<Radio items={items} value={items[0].value} onChange={() => {}} />, {
      wrapperProps: { editor: { readonly: true } }
    });
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-disabled');
    expect(screen.getByRole('radio', { name: 'Test' })).toBeDisabled();
  });
});
