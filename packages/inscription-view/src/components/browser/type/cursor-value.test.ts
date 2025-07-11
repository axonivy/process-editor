import { IvyIcons } from '@axonivy/ui-icons';
import { expect, test } from 'vitest';
import { getCursorValue } from './cursor-value';
import type { TypeBrowserObject } from './TypeBrowser';

const value: TypeBrowserObject = {
  simpleName: 'SampleType',
  fullQualifiedName: 'com.example.SampleType',
  icon: IvyIcons.ActivitiesGroup,
  packageName: 'com.example'
};

test('getCursorValue handles IvyType and typeAsList and inCodeBlock', () => {
  expect(getCursorValue(value, true, true, true)).toEqual('List<SampleType>');
});

test('getCursorValue handles IvyType, typeAsList, and not inCodeBlock', () => {
  expect(getCursorValue(value, true, true, false)).toEqual('List<SampleType>');
});

test('getCursorValue handles IvyType, non-typeAsList, and inCodeBlock', () => {
  expect(getCursorValue(value, true, false, true)).toEqual('SampleType');
});

test('getCursorValue handles no IvyType, typeAsList, and inCodeBlock', () => {
  expect(getCursorValue(value, false, true, true)).toEqual('List<SampleType>');
});

test('getCursorValue handles non-IvyType and non-typeAsList an inCodeBlock', () => {
  expect(getCursorValue(value, false, false, true)).toEqual('SampleType');
});

test('getCursorValue handles IvyType, not-typeAsList, and not inCodeBlock', () => {
  expect(getCursorValue(value, true, false, false)).toEqual('SampleType');
});

test('getCursorValue handles non-IvyType, typeAsList, and not inCodeBlock', () => {
  expect(getCursorValue(value, false, true, false)).toEqual('List<com.example.SampleType>');
});

test('getCursorValue handles non-IvyType and non-typeAsList and not inCodeBlock', () => {
  expect(getCursorValue(value, false, false, false)).toEqual('com.example.SampleType');
});

// Add more test cases for other scenarios
