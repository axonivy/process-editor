import type { DataclassType } from '@axonivy/process-editor-inscription-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { expect, test } from 'vitest';
import { getCursorValue } from './cursor-value';

const value: BrowserNode<DataclassType> = {
  value: 'SampleType',
  icon: IvyIcons.ActivitiesGroup,
  info: 'com.example',
  children: [],
  data: {
    fullQualifiedName: 'com.example.SampleType',
    name: 'SampleType',
    packageName: 'com.example',
    path: ''
  }
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
