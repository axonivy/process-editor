import { useEffect, useRef, useState } from 'react';
import { useFocusWithin } from 'react-aria';
import { useBrowser } from './useBrowser';

export const useOnFocus = (
  initialValue: string,
  onChange: (change: string) => void
): {
  isFocusWithin: boolean;
  focusWithinProps: ReturnType<typeof useFocusWithin>['focusWithinProps'];
  focusValue: { value: string; onChange: React.Dispatch<React.SetStateAction<string>> };
  browser: ReturnType<typeof useBrowser>;
} => {
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [focusValue, setFocusValue] = useState(initialValue);
  const [prevFocusValue, setPrevFocusValue] = useState(initialValue);
  const browser = useBrowser();
  const latestFocusValueRef = useRef(focusValue);
  const latestOnChangeRef = useRef(onChange);
  const isFocusWithinRef = useRef(isFocusWithin);
  const lastCommittedValueRef = useRef(initialValue);

  latestFocusValueRef.current = focusValue;
  latestOnChangeRef.current = onChange;
  isFocusWithinRef.current = isFocusWithin;

  useEffect(() => {
    return () => {
      const hasUncommittedChange = latestFocusValueRef.current !== lastCommittedValueRef.current;
      if (isFocusWithinRef.current && hasUncommittedChange) {
        latestOnChangeRef.current(latestFocusValueRef.current);
      }
    };
  }, []);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: () => {
      isFocusWithinRef.current = true;
      setIsFocusWithin(true);
    },
    onBlurWithin: () => {
      if (!browser.open) {
        isFocusWithinRef.current = false;
        setIsFocusWithin(false);
        onChange(focusValue);
        lastCommittedValueRef.current = focusValue;
      }
    }
  });
  if (initialValue !== prevFocusValue) {
    setFocusValue(initialValue);
    setPrevFocusValue(initialValue);
    lastCommittedValueRef.current = initialValue;
  }
  return { isFocusWithin, focusWithinProps, focusValue: { value: focusValue, onChange: setFocusValue }, browser };
};
