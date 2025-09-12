import { IvyIcons } from '@axonivy/ui-icons';
import { customRender, screen, userEvent } from 'test-utils';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Part from './Part';
import type { PartProps, PartStateFlag } from './usePart';

const ErrorWidget = () => {
  throw new Error('this is an exception');
};

describe('Part', () => {
  const generalPart: PartProps = {
    id: 'General',
    name: 'General',
    state: { state: undefined, validations: [] },
    content: <h1>General</h1>,
    icon: IvyIcons.InfoCircle
  };
  const callPart: PartProps = {
    id: 'Call',
    name: 'Call',
    state: { state: 'warning', validations: [] },
    content: <h1>Call</h1>,
    icon: IvyIcons.InfoCircle
  };
  const resultPart: PartProps = {
    id: 'Result',
    name: 'Result',
    state: { state: 'error', validations: [] },
    content: <h1>Result</h1>,
    icon: IvyIcons.InfoCircle
  };
  const errorPart: PartProps = {
    id: 'Error',
    name: 'Error',
    state: { state: 'error', validations: [] },
    content: <ErrorWidget />,
    icon: IvyIcons.InfoCircle
  };

  function renderPart(partProps: PartProps[]): {
    data: () => PartProps;
    rerender: () => void;
  } {
    const part = partProps;
    const view = customRender(<Part parts={part} />);
    return {
      data: () => part[0]!,
      rerender: () => view.rerender(<Part parts={part} />)
    };
  }

  const original = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = original;
  });

  test('render', () => {
    renderPart([generalPart]);
    assertActive('General', 'active');
  });

  test('state', () => {
    renderPart([generalPart]);
    assertPartState('General', undefined);
    renderPart([callPart]);
    assertPartState('Call', 'warning');
    renderPart([resultPart]);
    assertPartState('Result', 'error');
  });

  test('open tab', async () => {
    renderPart([generalPart, callPart]);
    assertActive('General', 'active');
    assertActive('Call', 'inactive');
    const trigger = screen.getByRole('tab', { name: 'Call' });
    await userEvent.click(trigger);
    assertActive('General', 'inactive');
    assertActive('Call', 'active');
  });

  test('open section by keyboard', async () => {
    renderPart([generalPart, callPart]);
    const trigger = screen.getByRole('tab', { name: 'General' });
    await userEvent.click(trigger);
    expect(trigger).toHaveFocus();
    assertActive('General', 'active');
    await userEvent.keyboard('[ArrowRight]');
    assertActive('Call', 'active');
    assertActive('General', 'inactive');
    await userEvent.keyboard('[ArrowLeft]');
    assertActive('Call', 'inactive');
    assertActive('General', 'active');
  });

  test('part render error', async () => {
    renderPart([errorPart]);
    await userEvent.click(screen.getByRole('tab', { name: 'Error' }));
    expect(screen.getByRole('alert')).toHaveTextContent('this is an exception');
    expect(console.error).toHaveBeenCalled();
  });

  function assertActive(tabName: string, expanded: 'active' | 'inactive') {
    expect(screen.getByRole('tab', { name: tabName })).toHaveAttribute('data-state', expanded);
  }

  function assertPartState(tabName: string, state: PartStateFlag) {
    const stateDot = screen.getByRole('tab', { name: tabName }).querySelector('.ui-state-dot');
    if (state) {
      expect(stateDot).not.toBeNull();
      expect(stateDot).toHaveAttribute('data-state', state);
    } else {
      expect(stateDot).toBeNull();
    }
  }
});
