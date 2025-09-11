import type { AlternativeConditions, ConnectorRef, InscriptionType } from '@axonivy/process-editor-inscription-protocol';
import { describe, expect, test } from 'vitest';
import { Condition } from './condition';

describe('Condition', () => {
  const altConditions: AlternativeConditions = {
    f1: 'false',
    f6: 'in.accept == true',
    f8: ''
  };

  const conditions: Condition[] = [
    { fid: 'f1', expression: 'false' },
    { fid: 'f6', expression: 'in.accept == true' },
    { fid: 'f8', expression: '' }
  ];

  const altType: InscriptionType = {
    description: '',
    iconId: '',
    id: 'Alternative',
    impl: '',
    label: '',
    shortLabel: '',
    helpUrl: ''
  };

  test('of', () => {
    expect(Condition.of(altConditions)).toEqual(conditions);
  });

  test('replace', () => {
    const ref: ConnectorRef = {
      name: 'flow',
      pid: 'asdf-f6',
      source: { name: 'alternative', pid: 'f5', type: altType },
      target: { name: 'end', pid: 'f7', type: altType }
    };
    const expected = structuredClone(conditions);
    expected[1]!.target = ref.target;
    expect(Condition.replace(structuredClone(conditions), ref)).toEqual(expected);
  });

  test('replace - undefined', () => {
    const ref = undefined as unknown as ConnectorRef;
    expect(Condition.replace(structuredClone(conditions), ref)).toEqual(conditions);
  });

  test('replace - null', () => {
    const ref = null as unknown as ConnectorRef;
    expect(Condition.replace(structuredClone(conditions), ref)).toEqual(conditions);
  });

  test('replace - unknown', () => {
    const ref: ConnectorRef = {
      name: 'flow',
      pid: 'asdf-f7',
      source: { name: 'alternative', pid: 'f5', type: altType },
      target: { name: 'end', pid: 'f7', type: altType }
    };
    expect(Condition.replace(structuredClone(conditions), ref)).toEqual(conditions);
  });

  test('remove', () => {
    const expected = [];
    expected.push(conditions[0], conditions[2]);
    expect(Condition.remove(structuredClone(conditions), 'f6')).toEqual(expected);
  });

  test('move', () => {
    const expected = [];
    expected.push(conditions[1], conditions[0], conditions[2]);
    expect(Condition.move(structuredClone(conditions), 'f6', 'f1')).toEqual(expected);
  });

  test('update', () => {
    const expected = structuredClone(conditions);
    expected[1]!.expression = 'test';
    expect(Condition.update(structuredClone(conditions), 1, 'expression', 'test')).toEqual(expected);
  });

  test('to', () => {
    expect(Condition.to(conditions)).toEqual(altConditions);
  });

  const embeddedConditions: Condition[] = [
    { fid: 'S0-f1', expression: 'false' },
    { fid: 'S0-f8', expression: '' }
  ];

  test('embedded condition', () => {
    const ref: ConnectorRef = {
      name: 'flow',
      pid: 'asdf-S0-f8',
      source: { name: 'alternative', pid: 'f5', type: altType },
      target: { name: 'end', pid: 'f7', type: altType }
    };
    const expected = structuredClone(embeddedConditions);
    expected[1]!.target = ref.target;
    expect(Condition.replace(structuredClone(embeddedConditions), ref)).toEqual(expected);
  });
});
