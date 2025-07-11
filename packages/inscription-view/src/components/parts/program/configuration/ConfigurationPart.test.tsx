import type { ConfigurationData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useConfigurationPart } from './ConfigurationPart';

const Part = () => {
  const part = useConfigurationPart();
  return <>{part.content}</>;
};

describe('ConfigurationPart', () => {
  function renderPart(data?: DeepPartial<ConfigurationData>) {
    customRender(<Part />, {
      wrapperProps: {
        data: data && { config: data },
        meta: {
          widgets: [
            { text: 'Path of directory to scan', multiline: false, widgetType: 'LABEL' },
            { configKey: 'directory', multiline: false, widgetType: 'TEXT' },
            { text: 'Multiline-Text', multiline: true, widgetType: 'LABEL' }
          ]
        }
      }
    });
  }

  test('empty data', async () => {
    customRender(<Part />);
    expect(screen.getByTitle('No configuration needed')).toBeInTheDocument();
  });

  test('full data', async () => {
    renderPart({
      userConfig: { directory: '/tmp/myDir' }
    });
    await screen.findByText('Path of directory to scan');
    expect(screen.getByDisplayValue('/tmp/myDir')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ConfigurationData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useConfigurationPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      userConfig: { directory: '/tmp/myDir' }
    });
  });
});
