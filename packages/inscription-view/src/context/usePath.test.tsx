import { describe, expect, test } from 'vitest';
import { mergePaths } from './usePath';

describe('mergePath', () => {
  test('empty parent', async () => {
    expect(mergePaths('', [])).toEqual('');

    expect(mergePaths('', ['bla', 'hi'])).toEqual('bla.hi');
    expect(mergePaths('', ['bla.hi'])).toEqual('bla.hi');
    expect(mergePaths('', [15])).toEqual('[15]');
    expect(mergePaths('', [1, 15])).toEqual('[1].[15]');
  });

  test('merge', async () => {
    expect(mergePaths('test', [])).toEqual('test');
    expect(mergePaths('test', [''])).toEqual('test');

    expect(mergePaths('test', ['bla'])).toEqual('test.bla');
    expect(mergePaths('test', ['bla', 'hi'])).toEqual('test.bla.hi');
    expect(mergePaths('test.1', ['bla.hi'])).toEqual('test.1.bla.hi');

    expect(mergePaths('test', [1])).toEqual('test.[1]');
    expect(mergePaths('test.bla', [15])).toEqual('test.bla.[15]');
  });
});
