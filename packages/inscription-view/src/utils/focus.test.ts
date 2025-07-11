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
