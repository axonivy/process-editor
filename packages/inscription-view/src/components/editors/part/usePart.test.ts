import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import { customRenderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartProps, PartStateFlag } from './usePart';
import { useInscriptionTabState, usePartState } from './usePart';

describe('usePartState', () => {
  function assertState(expectedState: PartStateFlag, data?: unknown, message?: ValidationResult[]) {
    const { result } = customRenderHook(() => usePartState({}, data ?? {}, message ?? []));
    expect(result.current.state).toEqual(expectedState);
  }

  test('states', async () => {
    assertState(undefined);
    assertState('configured', { something: 'else' });
    assertState('configured', { something: 'else' }, [{ path: '', severity: 'INFO', message: '' }]);
    assertState('warning', { something: 'else' }, [
      { path: '', severity: 'INFO', message: '' },
      { path: '', severity: 'WARNING', message: '' }
    ]);
    assertState('error', { something: 'else' }, [
      { path: '', severity: 'INFO', message: '' },
      { path: '', severity: 'WARNING', message: '' },
      { path: '', severity: 'ERROR', message: '' }
    ]);
  });
});

describe('useInscriptionTabState', () => {
  const INSCRIPTIONTAB_STORAGE_KEY = 'process-inscription-tab';
  const parts = [{ id: 'General' }, { id: 'Dialog' }] as Array<PartProps>;

  test('empty storage', () => {
    const { result } = customRenderHook(() => useInscriptionTabState(parts));
    expect(result.current.value).toEqual('General');
  });

  test('wrong storage', () => {
    sessionStorage.setItem(INSCRIPTIONTAB_STORAGE_KEY, 'wrong');
    const { result } = customRenderHook(() => useInscriptionTabState(parts));
    expect(result.current.value).toEqual('');
  });

  test('other storage', () => {
    sessionStorage.setItem(INSCRIPTIONTAB_STORAGE_KEY, `["Result"]`);
    const { result } = customRenderHook(() => useInscriptionTabState(parts));
    expect(result.current.value).toEqual('General');
  });

  test('matching storage', () => {
    sessionStorage.setItem(INSCRIPTIONTAB_STORAGE_KEY, `["Result", "Dialog"]`);
    const { result } = customRenderHook(() => useInscriptionTabState(parts));
    expect(result.current.value).toEqual('Dialog');
    result.current.updateValue('');
    expect(sessionStorage.getItem(INSCRIPTIONTAB_STORAGE_KEY)).toEqual(`["Result"]`);
  });
});
