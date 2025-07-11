import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { Tab } from './Tab';
import { Tabs } from './Tab';

describe('Tabs', () => {
  const tabs: Tab[] = [
    { id: '1', name: 'Name', content: <h1>Name</h1> },
    {
      id: 'asdf',
      name: 'Call',
      content: <h1>Call</h1>,
      messages: [
        { message: 'hi1', severity: 'WARNING' },
        { message: 'hi2', severity: 'ERROR' }
      ]
    },
    { id: 'hi', name: 'Result', content: <h1>Result</h1>, messages: [{ message: 'hi1', severity: 'WARNING' }] }
  ];

  function renderTabs() {
    customRender(<Tabs tabs={tabs} />);
  }

  test('render', () => {
    renderTabs();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Name');
  });

  test('switch tab', async () => {
    renderTabs();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Name');

    const call = screen.getByRole('tab', { name: /Call/ });
    await userEvent.click(call);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Call');

    const result = screen.getByRole('tab', { name: /Result/ });
    await userEvent.click(result);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Result');

    const name = screen.getByRole('tab', { name: /Name/ });
    await userEvent.click(name);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Name');
  });

  test('switch tab by keyboard', async () => {
    renderTabs();

    const name = screen.getByRole('tab', { name: /Name/ });
    const call = screen.getByRole('tab', { name: /Call/ });
    const result = screen.getByRole('tab', { name: /Result/ });

    await userEvent.tab();
    expect(name).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Name');

    await userEvent.keyboard('[ArrowRight]');
    expect(call).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Call');

    await userEvent.keyboard('[ArrowRight]');
    expect(result).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Result');

    await userEvent.keyboard('[ArrowLeft]');
    expect(call).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Call');
  });

  test('tab show state', async () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: /Name/ })).not.toHaveAttribute('data-message');
    expect(screen.getByRole('tab', { name: /Call/ })).toHaveAttribute('data-message', 'error');
    expect(screen.getByRole('tab', { name: /Result/ })).toHaveAttribute('data-message', 'warning');
  });
});
