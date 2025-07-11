import type { CacheData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useCachePart } from './CachePart';

const Part = () => {
  const part = useCachePart();
  return <>{part.content}</>;
};

describe('CachePart', () => {
  function renderPart(data?: CacheData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Do not cache' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Cache' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Invalidate Cache' })).not.toBeChecked();
    expect(screen.queryByText('Scope')).not.toBeInTheDocument();
    expect(screen.queryByText('Group')).not.toBeInTheDocument();
    expect(screen.queryByText('Entry')).not.toBeInTheDocument();
  });

  test('full data', async () => {
    renderPart({
      cache: {
        mode: 'CACHE',
        scope: 'SESSION',
        group: { name: 'asdf', invalidation: 'FIXED_TIME', time: '123' },
        entry: { name: 'jkl', invalidation: 'LIFETIME', time: '456' }
      }
    });
    expect(screen.getByRole('radio', { name: 'Cache' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Session' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Application' })).not.toBeChecked();
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Entry')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<CacheData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useCachePart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      cache: {
        mode: 'CACHE'
      }
    });

    assertState('error', undefined, { path: 'cache.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'cache.error', message: '', severity: 'WARNING' });
  });
});
