/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import i18n from 'i18next';
import 'reflect-metadata';
import { vi } from 'vitest';
import enTranslation from '../translation/process-editor/en.json';

//@ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

global.ResizeObserver = class ResizeObserver {
  [x: string]: any;
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};

global.DOMRect = {
  //@ts-ignore
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 })
};

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['process-editor'],
    defaultNS: 'process-editor',
    resources: { en: { 'process-editor': enTranslation } }
  });
};

initTranslation();
