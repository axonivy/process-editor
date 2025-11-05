export const focusAdjacentTabIndexMonaco = (direction: 'next' | 'previous', jumpOver?: number) => {
  if (!(document.activeElement instanceof HTMLElement)) return;

  const elements = document.querySelectorAll<HTMLElement>(
    'input, button, select, textarea, div.script-input, div.script-area, div.combobox-input, div.native-edit-context'
  );
  // skip elements that are not visible, cf. https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  // skip elements that are not focussable (tabIndex -1)
  const validFocusable = Array.from(elements).filter(element => element.offsetParent !== null && element.tabIndex !== -1);
  const currentElement = document.activeElement;
  const currentIndex = validFocusable.indexOf(currentElement);
  if (currentIndex === -1) {
    return;
  }

  const nextElement = validFocusable[currentIndex + (direction === 'next' ? 1 + (jumpOver ?? 0) : -(1 + (jumpOver ?? 0)))];

  if (nextElement) {
    nextElement.focus();
  }
};
