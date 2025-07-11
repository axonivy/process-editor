import { describe, expect, test } from 'vitest';
import { deepEqual } from './equals';

describe('equals', () => {
  test('equals is true', () => {
    expect(deepEqual({}, {})).toBeTruthy();
    expect(deepEqual([], [])).toBeTruthy();

    expect(deepEqual({ a: '' }, { a: '' })).toBeTruthy();
    expect(deepEqual({ a: 'a' }, { a: 'a' })).toBeTruthy();
    expect(deepEqual({ a: [] }, { a: [] })).toBeTruthy();
    expect(deepEqual({ a: ['a', 'b'] }, { a: ['a', 'b'] })).toBeTruthy();

    expect(deepEqual(['a', 'b'], ['a', 'b'])).toBeTruthy();
    expect(deepEqual(['a', [true, false]], ['a', [true, false]])).toBeTruthy();

    expect(deepEqual({ a: { b: [{ c: 'c' }] } }, { a: { b: [{ c: 'c' }] } })).toBeTruthy();
  });

  test('equals is false', () => {
    expect(deepEqual({ a: '' }, { a: 'a' })).toBeFalsy();
    expect(deepEqual({ a: [] }, { a: ['a'] })).toBeFalsy();

    expect(deepEqual({ a: { b: [{ c: 'c' }] } }, { a: { b: [] } })).toBeFalsy();
    expect(deepEqual({ a: { b: [{ c: 'c' }] } }, { a: { b: [{ c: 'c' }, { d: 'd' }] } })).toBeFalsy();
    expect(deepEqual({ a: { b: [{ c: 'c' }] } }, { a: { b: [{ d: 'd' }] } })).toBeFalsy();

    expect(deepEqual(['a'], ['a', 'b'])).toBeFalsy();
    expect(deepEqual(['a', 'b'], ['a,b'])).toBeFalsy();
    expect(deepEqual(['a', [true, false]], ['a', [true, true]])).toBeFalsy();
    expect(deepEqual(['a', [true, false]], ['a', [true, [false]]])).toBeFalsy();
  });
});
