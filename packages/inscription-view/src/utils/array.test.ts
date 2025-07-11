import { describe, expect, test } from 'vitest';
import { arraymove, indexOf } from './array';

describe('array', () => {
  test('indexOf', () => {
    const array = [{ a: 1 }, { a: 2 }];
    expect(indexOf(array, obj => obj.a === 1)).toEqual(0);
    expect(indexOf(array, obj => obj.a === 2)).toEqual(1);
    expect(indexOf(array, obj => obj.a === 3)).toEqual(-1);
  });

  test('movearray', () => {
    const array = [{ a: 1 }, { a: 2 }];
    expect(array).toEqual(array);
    arraymove(array, 0, 1);
    expect(array).toEqual([{ a: 2 }, { a: 1 }]);
  });
});
