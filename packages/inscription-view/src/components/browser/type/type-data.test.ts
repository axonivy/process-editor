/* eslint-disable testing-library/no-node-access */
import type { DataclassType, JavaType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { useTypeData } from './type-data';

const dataClasses: DataclassType[] = [
  { fullQualifiedName: 'com.example.ClassA', name: 'ClassA', packageName: 'com.example', path: '/path/ClassA' },
  { fullQualifiedName: 'com.example.ClassB', name: 'ClassB', packageName: 'com.example', path: '/path/ClassB' }
];

const ivyTypes: JavaType[] = [
  { fullQualifiedName: 'ivy.IvyTypeA', packageName: 'ivy', simpleName: 'IvyTypeA' },
  { fullQualifiedName: 'com.example.TypeB', packageName: 'com.example', simpleName: 'TypeB' }
];

const nonIvyTypes: JavaType[] = [
  { fullQualifiedName: 'com.other.TypeC', packageName: 'com.other', simpleName: 'TypeC' },
  { fullQualifiedName: 'com.other.TypeD', packageName: 'com.other', simpleName: 'TypeD' }
];

const ownTypes: JavaType[] = [{ fullQualifiedName: 'com.own.TypeE', packageName: 'com.own', simpleName: 'TypeE' }];

const allTypes: JavaType[] = [
  { fullQualifiedName: 'com.example.TypeB', packageName: 'com.example', simpleName: 'TypeB' },
  { fullQualifiedName: 'ivy.IvyTypeF', packageName: 'ivy', simpleName: 'IvyTypeF' },
  { fullQualifiedName: 'com.own.TypeE', packageName: 'com.own', simpleName: 'TypeE' }
];

describe('typeData', () => {
  test('returns empty array if both input arrays are empty', () => {
    const { result } = renderHook(() => useTypeData([], [], [], [], false));
    expect(result.current.length).toEqual(2);
  });

  test('returns sorted data class nodes when dataClasses are provided', () => {
    const { result } = renderHook(() => useTypeData(dataClasses, [], [], [], false));
    expect(result.current).toHaveLength(2);
    expect(result.current[0]?.children[0]?.value).toBe('ClassA');
    expect(result.current[0]?.children[1]?.value).toBe('ClassB');
  });

  test('returns sorted non-Ivy type nodes when ivyTypes are provided', () => {
    const { result } = renderHook(() => useTypeData([], nonIvyTypes, [], [], false));
    expect(result.current).toHaveLength(2);
    expect(result.current[1]?.children[0]?.value).toBe('TypeC');
    expect(result.current[1]?.children[1]?.value).toBe('TypeD');
  });

  test('returns combined sorted nodes from dataClasses and non-Ivy and Ivy types', () => {
    const { result } = renderHook(() => useTypeData(dataClasses, [...nonIvyTypes, ...ivyTypes], [], [], false));
    expect(result.current[0]?.children).toHaveLength(2);
    expect(result.current[1]?.children).toHaveLength(4);
    expect(result.current[0]?.children[0]?.value).toBe('ClassA');
    expect(result.current[0]?.children[1]?.value).toBe('ClassB');
    expect(result.current[1]?.children[0]?.value).toBe('TypeB');
    expect(result.current[1]?.children[1]?.value).toBe('TypeC');
    expect(result.current[1]?.children[2]?.value).toBe('TypeD');
    expect(result.current[1]?.children[3]?.value).toBe('IvyTypeA');
  });

  test('correctly classifies and sorts Ivy and non-Ivy types', () => {
    const { result } = renderHook(() => useTypeData(dataClasses, ivyTypes, [], [], false));
    expect(result.current[0]?.children).toHaveLength(2);
    expect(result.current[1]?.children).toHaveLength(2);
    expect(result.current[0]?.children[0]?.value).toBe('ClassA');
    expect(result.current[0]?.children[1]?.value).toBe('ClassB');
    expect(result.current[1]?.children[0]?.value).toBe('TypeB');
    expect(result.current[1]?.children[1]?.value).toBe('IvyTypeA');
  });

  test('returns nodes with correct icons', () => {
    const { result } = renderHook(() => useTypeData(dataClasses, ivyTypes, [], [], false));
    expect(result.current[0]?.children[0]?.icon).toBe(IvyIcons.LetterD);
    expect(result.current[1]?.children[0]?.icon).toBe(IvyIcons.Ivy);
    expect(result.current[1]?.children[1]?.icon).toBe(IvyIcons.Ivy);
  });

  test('includes ownTypes if allTypesSearchActive is false', () => {
    const { result } = renderHook(() => useTypeData([], [], ownTypes, [], false));
    expect(result.current).toHaveLength(3);
    expect(result.current[2]?.children[0]?.value).toBe('TypeE');
    expect(result.current[2]?.icon).toBe(IvyIcons.DataClass);
  });

  test('does not include ownTypes if allTypesSearchActive is true', () => {
    const { result } = renderHook(() => useTypeData([], [], ownTypes, [], true));
    expect(result.current).toHaveLength(0);
  });

  test('returns sorted allTypes when allTypesSearchActive is true', () => {
    const { result } = renderHook(() => useTypeData([], [], [], allTypes, true));
    expect(result.current).toHaveLength(3);
    expect(result.current[0]?.value).toBe('IvyTypeF');
    expect(result.current[1]?.value).toBe('TypeB');
    expect(result.current[2]?.value).toBe('TypeE');
  });

  test('returns sorted combined types when allTypesSearchActive is true and filtered types are present', () => {
    const { result } = renderHook(() => useTypeData(dataClasses, ivyTypes, ownTypes, allTypes, true));
    expect(result.current).toHaveLength(6);
    expect(result.current[0]?.value).toBe('ClassA');
    expect(result.current[1]?.value).toBe('ClassB');
    expect(result.current[2]?.value).toBe('IvyTypeA');
    expect(result.current[3]?.value).toBe('IvyTypeF');
    expect(result.current[4]?.value).toBe('TypeB');
    expect(result.current[5]?.value).toBe('TypeE');
  });

  test('sorts combined types correctly when allTypesSearchActive is false', () => {
    const { result } = renderHook(() => useTypeData(dataClasses, ivyTypes, ownTypes, allTypes, false));
    expect(result.current).toHaveLength(3);
    expect(result.current[2]?.children[0]?.value).toBe('TypeE');
    expect(result.current[0]?.children[0]?.value).toBe('ClassA');
    expect(result.current[0]?.children[1]?.value).toBe('ClassB');
    expect(result.current[1]?.children[0]?.value).toBe('TypeB');
    expect(result.current[1]?.children[1]?.value).toBe('IvyTypeA');
  });
});
