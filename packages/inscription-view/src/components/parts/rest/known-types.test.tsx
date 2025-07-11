import type { RestPayload } from '@axonivy/process-editor-inscription-protocol';
import { describe, expect, test } from 'vitest';
import { evalBodyType, evalInputType, isFormMedia, typesSupportBinary } from './known-types';

describe('Known Types', () => {
  test('evalInputType', async () => {
    expect(evalInputType({ type: { type: { fullQualifiedName: 'java.io.File' } } } as RestPayload, 'current', 'java.io.File')).toEqual(
      'java.io.File'
    );
    expect(evalInputType({ type: { type: { fullQualifiedName: 'java.io.File' } } } as RestPayload, '[B', 'java.io.File')).toEqual('[B');
    expect(evalInputType({ type: { type: { fullQualifiedName: 'ch.Pet' } } } as RestPayload, 'current', 'java.io.File')).toEqual('ch.Pet');
  });

  test('typesSupportBinary', async () => {
    expect(typesSupportBinary(['bla', 'test'])).toBeFalsy();
    expect(typesSupportBinary(['java.io.File', '[B'])).toBeTruthy();
  });

  test('evalBodyType', async () => {
    expect(evalBodyType('bla')).toEqual('ENTITY');
    expect(evalBodyType('multipart/form-data')).toEqual('FORM');
  });

  test('isFormMedia', () => {
    expect(isFormMedia('bla')).toBeFalsy();
    expect(isFormMedia('multipart/form-data')).toBeTruthy();
    expect(isFormMedia('application/x-www-form-urlencoded')).toBeTruthy();
  });
});
