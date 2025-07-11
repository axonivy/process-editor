import type { EventData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, SelectUtil, customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useEventPart } from './EventPart';

const Part = () => {
  const part = useEventPart();
  return <>{part.content}</>;
};

describe('EventPart', () => {
  function renderPart(data?: DeepPartial<EventData>) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertOpen('Java Class');
    await CollapsableUtil.assertOpen('Event ID');
    await CollapsableUtil.assertClosed('Expiry');
  });

  test('full data', async () => {
    renderPart({
      javaClass: 'Test',
      eventId: '123',
      timeout: {
        error: 'ivy:error:program:timeout',
        action: 'DESTROY_TASK',
        duration: '456'
      }
    });
    await ComboboxUtil.assertValue('Test', { nth: 0 });
    expect(screen.getAllByTestId('code-editor')[0]).toHaveValue('123');
    await CollapsableUtil.assertOpen('Expiry');
    await SelectUtil.assertValue('ivy:error:program:timeout', { index: 1 });
    expect(screen.getByLabelText('Duration')).toHaveValue('456');
    expect(screen.getByRole('radio', { name: 'Do nothing' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Delete the Task' })).toBeChecked();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<EventData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useEventPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { javaClass: 'Bla' });
    assertState('configured', { eventId: '123' });
    assertState('configured', { timeout: { duration: '123' } });

    assertState('error', undefined, { path: 'javaClass.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'eventId.error', message: '', severity: 'WARNING' });
    assertState('warning', undefined, { path: 'timeout.error', message: '', severity: 'WARNING' });
  });
});
