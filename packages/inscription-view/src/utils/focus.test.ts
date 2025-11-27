import { beforeEach, describe, expect, test } from 'vitest';
import { focusAdjacentTabIndexMonaco } from './focus';

describe('focusAdjacentTabIndexMonaco', () => {
  let input1: HTMLInputElement, input2: HTMLInputElement, button: HTMLButtonElement, div: HTMLDivElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <input type="text" id="input1" />
      <button id="button">Click me</button>
      <div tabindex="0" id="div1" />
      <input type="text" id="input2" />
      
    `;

    input1 = document.getElementById('input1') as HTMLInputElement;
    button = document.getElementById('button') as HTMLButtonElement;
    input2 = document.getElementById('input2') as HTMLInputElement;
    div = document.getElementById('div1') as HTMLDivElement;

    // in jsdom, offsetParent is always null, so we need to mock it, cf. https://github.com/jsdom/jsdom/issues/1261#issuecomment-147720681
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get(this: HTMLElement) {
        // if element or ancestor has display:none -> null
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let element: HTMLElement | null = this;
        while (element) {
          if (element.style && element.style.display.toLowerCase() === 'none') {
            return null;
          }
          element = element.parentElement;
        }

        // position: fixed -> null
        if (this.style && this.style.position.toLowerCase() === 'fixed') {
          return null;
        }

        // <html> / <body> -> null
        if (['HTML', 'BODY'].includes(this.tagName)) {
          return null;
        }

        // otherwise pretend parentElement is the offsetParent
        return this.parentElement;
      }
    });
  });

  test('focus the next focusable element', () => {
    input1.focus();
    focusAdjacentTabIndexMonaco('next');
    expect(document.activeElement).toBe(button);
  });

  test('focus the previous focusable element', () => {
    input2.focus();
    focusAdjacentTabIndexMonaco('previous');
    expect(document.activeElement).toBe(button);
  });

  test('do nothing if there is no active element', () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    focusAdjacentTabIndexMonaco('next');
    expect(document.activeElement).not.toBe(input1);
    expect(document.activeElement).not.toBe(button);
  });

  test('do nothing if there is no next or previous element', () => {
    div.focus();
    focusAdjacentTabIndexMonaco('next');
    expect(document.activeElement).toBe(div);
  });
});
