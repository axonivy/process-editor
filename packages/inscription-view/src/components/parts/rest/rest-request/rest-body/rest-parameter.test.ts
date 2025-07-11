import type { RestParameter } from '@axonivy/process-editor-inscription-protocol';
import { cloneObject } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { RestParam } from './rest-parameter';
import { restParamBuilder, toRestMap, updateRestParams } from './rest-parameter';

describe('RestParam', () => {
  const params: RestParam[] = [
    { name: 'file', expression: '', known: true, type: 'java.io.File', doc: 'file' },
    { name: 'ownerId', expression: '', known: true, type: 'java.lang.Long', doc: '* required\nowner' }
  ];

  const expressionParams = cloneObject(params);
  expressionParams[0].expression = '123';
  expressionParams[1].expression = '4';

  const restParam: RestParameter = {
    name: 'para',
    type: { fullQualifiedName: 'FormPara' },
    required: false,
    properties: [
      { name: 'file', type: { fullQualifiedName: 'java.io.File' }, properties: [], required: false, doc: 'file' },
      { name: 'ownerId', type: { fullQualifiedName: 'java.lang.Long' }, properties: [], required: true, doc: 'owner' }
    ],
    doc: 'form params'
  };

  test('of - empty', () => {
    expect(restParamBuilder().build()).toEqual([]);
  });

  test('of - unknown prop', () => {
    const result: RestParam = { name: 'test', expression: '123', known: false };
    expect(
      restParamBuilder()
        .restMap({ test: ['123'] })
        .build()
    ).toEqual([result]);
  });

  test('of - multiple same props', () => {
    const result: RestParam[] = [
      { name: 'test', expression: '123', known: false },
      { name: 'test', expression: 'blabla', known: false }
    ];
    expect(
      restParamBuilder()
        .restMap({ test: ['123', 'blabla'] })
        .build()
    ).toEqual(result);
  });

  test('of - known prop', () => {
    expect(restParamBuilder().openApiParam(restParam).build()).toEqual(params);
  });

  test('of - mixed', () => {
    const expectedParams = cloneObject(params);
    expectedParams[1].expression = '4';
    expectedParams.push({ name: 'test', known: false, expression: '123' });
    expect(
      restParamBuilder()
        .openApiParam(restParam)
        .restMap({ ownerId: ['4'], test: ['123'] })
        .build()
    ).toEqual(expectedParams);
  });

  test('update', () => {
    const expected = cloneObject(params);
    expected[1].expression = 'test';
    expect(updateRestParams(cloneObject(params), 1, 'expression', 'test')).toEqual(expected);
  });

  test('to', () => {
    expect(toRestMap(expressionParams)).toEqual({ file: ['123'], ownerId: ['4'] });
  });

  //Rest forms support multiple values for the same key
  test('to - multiple same attributes', () => {
    const sameParams = cloneObject(expressionParams);
    sameParams.push(params[0]);
    sameParams[2].expression = 'blabla';
    expect(toRestMap(sameParams)).toEqual({ file: ['123', 'blabla'], ownerId: ['4'] });
  });
});
