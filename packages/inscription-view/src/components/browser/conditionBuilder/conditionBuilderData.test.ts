import type { ConditionGroupData } from '@axonivy/ui-components';
import { describe, expect, test } from 'vitest';
import { generateConditionString } from './conditionBuilderData';

describe('generateConditionString', () => {
  test('returns "true" for always-true mode', () => {
    const result = generateConditionString('always-true', []);
    expect(result).toBe('true');
  });

  test('returns "false" for always-false mode', () => {
    const result = generateConditionString('always-false', []);
    expect(result).toBe('false');
  });

  test('handles a basic condition with a single group', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [{ argument1: 'age', operator: 'greater than', argument2: '18', logicalOperator: 'and' }],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('basic-condition', conditionGroups);
    expect(result).toBe('"age" > 18');
  });

  test('wraps arguments in quotes if needed', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [
          { argument1: 'age', operator: 'greater than', argument2: '18', logicalOperator: 'and' },
          { argument1: 'in.user', operator: 'equal to', argument2: 'admin', logicalOperator: 'and' }
        ],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('nested-condition', conditionGroups);
    expect(result).toBe('"age" > 18 && in.user == "admin"');
  });

  test('ignores additional groups in basic-condition mode', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [{ argument1: 'age', operator: 'greater than', argument2: '18', logicalOperator: 'and' }],
        logicalOperator: 'and'
      },
      {
        conditions: [{ argument1: 'status', operator: 'equal to', argument2: 'active', logicalOperator: 'or' }],
        logicalOperator: 'or'
      }
    ];
    const result = generateConditionString('basic-condition', conditionGroups);
    expect(result).toBe('"age" > 18');
  });

  test('handles nested-condition mode with multiple groups', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [
          { argument1: 'age', operator: 'greater than', argument2: '18', logicalOperator: 'and' },
          { argument1: 'status', operator: 'equal to', argument2: 'active', logicalOperator: 'or' }
        ],
        logicalOperator: 'or'
      },
      {
        conditions: [{ argument1: 'score', operator: 'less than', argument2: '50', logicalOperator: 'and' }],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('nested-condition', conditionGroups);
    expect(result).toBe('("age" > 18 && "status" == "active") || ("score" < 50)');
  });

  test('handles is true operator', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [{ argument1: 'isAdmin', operator: 'is true', argument2: '', logicalOperator: 'and' }],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('basic-condition', conditionGroups);
    expect(result).toBe('"isAdmin"');
  });

  test('handles is false operator', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [{ argument1: 'in.isAdmin', operator: 'is false', argument2: '', logicalOperator: 'and' }],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('basic-condition', conditionGroups);
    expect(result).toBe('!in.isAdmin');
  });

  test('handles is empty and is not empty operators', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [
          { argument1: 'in.names', operator: 'is empty', argument2: '', logicalOperator: 'and' },
          { argument1: 'in.names', operator: 'is not empty', argument2: '', logicalOperator: 'and' }
        ],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('basic-condition', conditionGroups);
    expect(result).toBe('in.names.isEmpty() && !in.names.isEmpty()');
  });

  test('handles multiple conditions with logical operators', () => {
    const conditionGroups: ConditionGroupData[] = [
      {
        conditions: [
          { argument1: 'age', operator: 'greater than', argument2: '18', logicalOperator: 'and' },
          { argument1: 'status', operator: 'equal to', argument2: 'active', logicalOperator: 'or' }
        ],
        logicalOperator: 'and'
      }
    ];
    const result = generateConditionString('nested-condition', conditionGroups);
    expect(result).toBe('"age" > 18 && "status" == "active"');
  });
});
