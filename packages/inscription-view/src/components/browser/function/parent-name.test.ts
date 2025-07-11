import type { Function } from '@axonivy/process-editor-inscription-protocol';
import type { Row } from '@tanstack/react-table';
import { expect, test } from 'vitest';
import type { DeepPartial } from '../../../test-utils/type-utils';
import { getParentNames } from './parent-name';

const mockFunction: DeepPartial<Row<Function>> = {
  original: {
    isField: true,
    name: 'ivy.cal',
    params: [],
    returnType: {
      functions: [],
      packageName: 'mockPackage',
      simpleName: 'mockSimpleName'
    }
  },
  getParentRow: () => ({
    original: {
      isField: false,
      name: 'get',
      params: [{ name: 'param1', type: 'String' }],
      returnType: {
        functions: [],
        packageName: 'mockPackage',
        simpleName: 'mockSimpleName'
      }
    },
    getParentRow: () => ({
      original: {
        isField: false,
        name: 'getBusinessDuration',
        params: [
          { name: 'param2', type: 'DateTime' },
          { name: 'param3', type: 'DateTime' }
        ],
        returnType: {
          functions: [],
          packageName: 'mockPackage',
          simpleName: 'mockSimpleName'
        }
      },
      getParentRow: () => undefined
    })
  })
};

test('getParentNames from mockFunction', () => {
  expect(getParentNames(mockFunction as Row<Function>)).toEqual(['ivy.cal', 'get(String)', 'getBusinessDuration(DateTime, DateTime)']);
});
