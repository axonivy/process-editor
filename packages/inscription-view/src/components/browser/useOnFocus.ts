import { useState } from 'react';
import { useFocusWithin } from 'react-aria';
import { useBrowser } from './useBrowser';

export const useOnFocus = (initialValue: string, onChange: (change: string) => void) => {
  const [isFocusWithin, setFocusWithin] = useState(false);
  const [focusValue, setFocusValue] = useState(initialValue);
  const [prevFocusValue, setPrevFocusValue] = useState(initialValue);
  const browser = useBrowser();
  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: () => setFocusWithin(true),
    onBlurWithin: () => {
      if (!browser.open) {
        setFocusWithin(false);
        onChange(focusValue);
      }
    }
  });
  if (initialValue !== prevFocusValue) {
    setFocusValue(initialValue);
    setPrevFocusValue(initialValue);
  }
  return { isFocusWithin, focusWithinProps, focusValue: { value: focusValue, onChange: setFocusValue }, browser };
};
