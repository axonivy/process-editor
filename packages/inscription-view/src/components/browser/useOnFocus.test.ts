import { StrictMode } from 'react';
import { act, renderHook } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import { useOnFocus } from './useOnFocus';

type FocusWithinCallbacks = {
  onFocusWithin?: () => void;
  onBlurWithin?: () => void;
};

const state = vi.hoisted(() => ({ callbacks: {} as FocusWithinCallbacks }));

vi.mock('react-aria', () => ({
  useFocusWithin: (callbacks: FocusWithinCallbacks) => {
    state.callbacks.onFocusWithin = callbacks.onFocusWithin;
    state.callbacks.onBlurWithin = callbacks.onBlurWithin;
    return { focusWithinProps: {} };
  }
}));

describe('useOnFocus', () => {
  test('commits latest value once when unmounted before blur', () => {
    const onChange = vi.fn();
    const { result, unmount } = renderHook(() => useOnFocus('init', onChange));

    act(() => state.callbacks.onFocusWithin?.());
    act(() => result.current.focusValue.onChange('edited value'));

    unmount();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('edited value');
  });

  test('does not double-commit after a normal blur commit', () => {
    const onChange = vi.fn();
    const { result, unmount } = renderHook(() => useOnFocus('init', onChange));

    act(() => state.callbacks.onFocusWithin?.());
    act(() => result.current.focusValue.onChange('edited value'));
    act(() => state.callbacks.onBlurWithin?.());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('edited value');
    unmount();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('does not call onChange on initial mount or StrictMode lifecycle simulation', () => {
    const onChange = vi.fn();
    const { unmount } = renderHook(() => useOnFocus('init', onChange), {
      wrapper: StrictMode
    });

    expect(onChange).not.toHaveBeenCalled();
    unmount();
    expect(onChange).not.toHaveBeenCalled();
  });
});
