import { useEffect, useState } from 'react';

const HISTORY_PINNED_STORAGE_KEY = 'process-editor.history.pinned';

export const useHistoryPinnedState = () => {
  const [pinned, setPinned] = useState(() => {
    try {
      return window.localStorage.getItem(HISTORY_PINNED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_PINNED_STORAGE_KEY, String(pinned));
    } catch {
      // Ignore storage failures (e.g. private mode).
    }
  }, [pinned]);

  return {
    pinned,
    togglePinned: () => setPinned(value => !value)
  };
};
