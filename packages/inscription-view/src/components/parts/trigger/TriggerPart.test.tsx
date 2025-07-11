import type { TriggerData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen, SelectUtil } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useTriggerPart } from './TriggerPart';

const Part = () => {
  const part = useTriggerPart();
  return <>{part.content}</>;
};

describe('TriggerPart', () => {
  function renderPart(data?: DeepPartial<TriggerData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(triggerable: boolean, responsible: string, delay: string) {
    const triggerCheckbox = screen.getByLabelText('Yes, this can be started with a Trigger Activity');
    if (triggerable) {
      expect(triggerCheckbox).toBeChecked();
      await SelectUtil.assertValue(responsible, { index: 0 });
      await CollapsableUtil.assertOpen('Options');
      expect(screen.getByLabelText('Attach to Business Case that triggered this process')).toBeChecked();
      expect(screen.getByLabelText('Delay')).toHaveValue(delay);
    } else {
      expect(triggerCheckbox).not.toBeChecked();
    }
  }

  test('empty data', async () => {
    renderPart();
    await assertMainPart(false, '', '');
  });

  test('no task', async () => {
    renderPart({ task: undefined });
    await assertMainPart(false, '', '');
  });

  test('full data', async () => {
    const triggerData: DeepPartial<TriggerData> = {
      triggerable: true,
      task: {
        delay: 'test',
        responsible: {
          type: 'ROLE_FROM_ATTRIBUTE',
          script: 'Test'
        }
      },
      case: {
        attachToBusinessCase: true
      }
    };
    renderPart(triggerData);
    await assertMainPart(true, 'Role from Attribute', 'test');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<TriggerData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useTriggerPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { triggerable: true });

    assertState(undefined, undefined, { path: 'task.name', message: '', severity: 'ERROR' });
    assertState('error', undefined, { path: 'task.delay', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'task.responsible', message: '', severity: 'WARNING' });
  });
});
