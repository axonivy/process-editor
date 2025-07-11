import { describe, expect, test } from 'vitest';
import { classifiedItemInfo } from './event-code-categorie';

describe('event code info', () => {
  test('info', () => {
    expect(classifiedItemInfo({ eventCode: 'ivy:code', process: 'process', project: 'project', usage: 0 })).toBeUndefined();
    expect(classifiedItemInfo({ eventCode: 'ivy:code', process: '', project: 'project', usage: 1 })).toEqual('project (1)');
    expect(classifiedItemInfo({ eventCode: 'ivy:code', process: '<INVALID>', project: 'project', usage: 1 })).toEqual('project (1)');
    expect(classifiedItemInfo({ eventCode: 'ivy:code', process: 'process', project: 'project', usage: 1 })).toEqual(
      'project > process (1)'
    );
  });
});
