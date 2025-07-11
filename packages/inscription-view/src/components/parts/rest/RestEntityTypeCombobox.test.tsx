import type { RestPayload } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { ComboboxUtil, customRender, renderHook } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { OpenApiContextProvider } from '../../../context/useOpenApi';
import { RestEntityTypeCombobox, useShowRestEntityTypeCombo } from './RestEntityTypeCombobox';

describe('RestEntityTypeCombobox', () => {
  function renderCombo(value: string, restEntityTypes?: string[]) {
    customRender(<RestEntityTypeCombobox value={value} onChange={() => {}} items={restEntityTypes ?? []} />, {
      wrapperProps: { meta: { restEntityTypes } }
    });
  }

  test('empty', async () => {
    renderCombo('');
    await ComboboxUtil.assertEmpty();
    await ComboboxUtil.assertOptionsCount(1);
  });

  test('unknown value', async () => {
    renderCombo('unknown', ['test', 'other']);
    await ComboboxUtil.assertValue('unknown');
    await ComboboxUtil.assertOptionsCount(3);
  });

  test('known value', async () => {
    renderCombo('test', ['test', 'other']);
    await ComboboxUtil.assertValue('test');
    await ComboboxUtil.assertOptionsCount(2);
  });
});

describe('useShowRestEntityTypeCombo', () => {
  function expectHook(types: string[], payload?: DeepPartial<RestPayload>) {
    const view = renderHook(() => useShowRestEntityTypeCombo(types, 'current', payload as RestPayload), {
      wrapper: props => <OpenApiContextProvider {...props} />
    });
    return expect(view.result.current);
  }

  test('openapi disabled', async () => {
    const view = renderHook(() => useShowRestEntityTypeCombo([], ''));
    expect(view.result.current).toBeTruthy();
  });

  test('no openapi', async () => {
    expectHook(['type']).toBeTruthy();
  });

  test('types support binary', async () => {
    expectHook(['type', '[B'], { type: { type: { fullQualifiedName: 'bla' } } }).toBeTruthy();
  });

  test('current type in openapi', async () => {
    expectHook(['type'], { type: { type: { fullQualifiedName: 'current' } } }).toBeFalsy();
  });
});
