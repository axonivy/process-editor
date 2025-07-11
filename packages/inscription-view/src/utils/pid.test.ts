import { describe, expect, test } from 'vitest';
import { PID } from './pid';

describe('PID', () => {
  const pid = '1478B7E447CD01B2';

  test('process id', () => {
    expect(PID.processId(pid)).toEqual(pid);
    expect(PID.processId(pid + '-f01')).toEqual(pid);
    expect(PID.processId(pid + '-S01-f01')).toEqual(pid);
  });

  test('field guid', () => {
    expect(PID.fieldId(pid)).toEqual('');
    expect(PID.fieldId(pid + '-f01')).toEqual('f01');
    expect(PID.fieldId(pid + '-S01-f01')).toEqual('S01-f01');
  });

  test('create child', () => {
    expect(PID.createChild(pid, 'f01')).toEqual(pid + '-f01');
    expect(PID.createChild(pid + '-S01', 'f01')).toEqual(pid + '-S01-f01');
  });
});
