import { useEffect, useState } from "react";
import { useFocusWithin } from "react-aria";
import { useBrowser } from "./useBrowser";

export const useOnFocus = (
  initialValue: string,
  onChange: (change: string) => void,
): {
  isFocusWithin: boolean;
  focusWithinProps: ReturnType<typeof useFocusWithin>["focusWithinProps"];
  focusValue: {
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
  };
  browser: ReturnType<typeof useBrowser>;
} => {
  const [isFocusWithin, setFocusWithin] = useState(false);
  const [focusValue, setFocusValue] = useState(initialValue);

  const browser = useBrowser();

  useEffect(() => {
    setFocusValue(initialValue);
  }, [initialValue]);

  const { focusWithinProps } = useFocusWithin({
    onFocusWithin: () => setFocusWithin(true),

    onBlurWithin: () => {
      if (!browser.open) {
        setFocusWithin(false);

        onChange(focusValue);
      }
    },
  });

  return {
    isFocusWithin,
    focusWithinProps,
    focusValue: { value: focusValue, onChange: setFocusValue },
    browser,
  };
};
