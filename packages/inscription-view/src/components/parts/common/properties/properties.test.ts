import type { ScriptMappings } from '@axonivy/process-editor-inscription-protocol';
import { describe, expect, test } from 'vitest';
import { Property } from './properties';

describe('Properties', () => {
  const props: ScriptMappings = {
    cache: '123',
    ssl: 'true'
  };

  const properties: Property[] = [
    { name: 'cache', expression: '123' },
    { name: 'ssl', expression: 'true' }
  ];

  test('of', () => {
    expect(Property.of(props)).toEqual(properties);
  });

  test('update', () => {
    const expected = structuredClone(properties);
    expected[1].expression = 'test';
    expect(Property.update(structuredClone(properties), 1, 'expression', 'test')).toEqual(expected);
  });

  test('to', () => {
    expect(Property.to(properties)).toEqual(props);
  });
});
