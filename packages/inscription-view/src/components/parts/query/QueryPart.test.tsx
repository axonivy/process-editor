import type { QueryData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, SelectUtil, customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useQueryPart } from './QueryPart';

const Part = () => {
  const part = useQueryPart();
  return <>{part.content}</>;
};

describe('QueryPart', () => {
  function renderPart(data?: DeepPartial<QueryData>) {
    customRender(<Part />, {
      wrapperProps: {
        data: data && { config: data },
        meta: {
          databases: ['IvySystemDatabase', 'test'],
          tables: ['Person'],
          columns: [{ name: 'column', type: 'VarChar(10)', ivyType: 'String' }]
        }
      }
    });
  }

  async function assertPage(data?: DeepPartial<QueryData>) {
    await SelectUtil.assertValue(data?.query?.sql?.kind ?? 'READ', { label: 'Query Kind' });
    await SelectUtil.assertOptionsCount(5, { label: 'Query Kind' });
    await SelectUtil.assertValue(data?.query?.dbName ?? '', { label: 'Database' });
    assertDynamicPart(data);
  }

  async function assertDynamicPart(data?: DeepPartial<QueryData>) {
    const table = screen.queryByLabelText('Table');
    const definition = screen.queryByRole('button', { name: 'Definition' });
    const fields = screen.queryByRole('button', { name: 'Fields' });
    const condition = screen.queryByRole('button', { name: 'Condition' });
    const sort = screen.queryByRole('button', { name: 'Sort' });
    const limit = screen.queryByRole('button', { name: 'Limit' });
    switch (data?.query?.sql?.kind) {
      case 'WRITE':
        expect(table).toBeInTheDocument();
        expect(definition).not.toBeInTheDocument();
        expect(fields).toBeInTheDocument();
        expect(condition).not.toBeInTheDocument();
        expect(sort).not.toBeInTheDocument();
        expect(limit).not.toBeInTheDocument();
        break;
      case 'UPDATE':
        expect(table).toBeInTheDocument();
        expect(definition).not.toBeInTheDocument();
        expect(fields).toBeInTheDocument();
        expect(condition).toBeInTheDocument();
        expect(sort).not.toBeInTheDocument();
        expect(limit).not.toBeInTheDocument();
        break;
      case 'DELETE':
        expect(table).toBeInTheDocument();
        expect(definition).not.toBeInTheDocument();
        expect(fields).not.toBeInTheDocument();
        expect(condition).toBeInTheDocument();
        expect(sort).not.toBeInTheDocument();
        expect(limit).not.toBeInTheDocument();
        break;
      case 'ANY':
        expect(table).not.toBeInTheDocument();
        expect(definition).toBeInTheDocument();
        expect(fields).not.toBeInTheDocument();
        expect(condition).not.toBeInTheDocument();
        expect(sort).not.toBeInTheDocument();
        expect(limit).toBeInTheDocument();
        break;
      default:
        expect(table).toBeInTheDocument();
        expect(definition).not.toBeInTheDocument();
        expect(fields).toBeInTheDocument();
        expect(condition).toBeInTheDocument();
        expect(sort).toBeInTheDocument();
        expect(limit).toBeInTheDocument();
    }
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Database');
    await CollapsableUtil.assertClosed('Fields');
    await CollapsableUtil.assertClosed('Condition');
    await CollapsableUtil.assertClosed('Sort');
    await CollapsableUtil.assertClosed('Limit');
  });

  test('read data', async () => {
    const data: DeepPartial<QueryData> = { query: { dbName: 'test', sql: { table: 'Person' } } };
    renderPart(data);
    await assertPage(data);
  });

  test('write data', async () => {
    const data: DeepPartial<QueryData> = { query: { dbName: 'test', sql: { table: 'Person', kind: 'WRITE' } } };
    renderPart(data);
    await assertPage(data);
  });

  test('update data', async () => {
    const data: DeepPartial<QueryData> = { query: { dbName: 'test', sql: { table: 'Person', kind: 'UPDATE' } } };
    renderPart(data);
    await assertPage(data);
  });

  test('delete data', async () => {
    const data: DeepPartial<QueryData> = { query: { dbName: 'test', sql: { table: 'Person', kind: 'DELETE' } } };
    renderPart(data);
    await assertPage(data);
  });

  test('any data', async () => {
    const data: DeepPartial<QueryData> = { query: { dbName: 'test', sql: { table: 'Person', kind: 'ANY' } } };
    renderPart(data);
    await assertPage(data);
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<QueryData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useQueryPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { query: { dbName: 'bla' } });

    assertState('error', undefined, { path: 'query.dbName', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'query.dbName', message: '', severity: 'WARNING' });
  });
});
