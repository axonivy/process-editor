import type { QueryData } from '@axonivy/process-editor-inscription-protocol';
import { SelectUtil, customRender, screen, userEvent, type DeepPartial } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import { DatabaseSelect } from './DatabaseSelect';

describe('DatabaseSelect', () => {
  function renderSelect(data?: DeepPartial<QueryData>, action?: () => void) {
    customRender(<DatabaseSelect />, {
      wrapperProps: {
        data: data && { config: data },
        elementContext: { app: '', pid: '', project: 'baseProject' },
        action,
        meta: {
          databases: [
            { name: 'ivy', iconUrl: '', project: 'project0' },
            { name: 'test', iconUrl: '', project: 'project1' },
            { name: 'db', iconUrl: '', project: 'project2' }
          ]
        }
      }
    });
  }

  test('data', async () => {
    renderSelect({ query: { dbName: 'test' } });
    await SelectUtil.assertValue('test');
    await SelectUtil.assertOptionsCount(3);
  });

  describe('openDatabaseConfig', () => {
    test('no selection', async () => {
      const action = vi.fn();
      renderSelect(undefined, action);
      await userEvent.click(screen.getByRole('button', { name: 'Open Database Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openDatabaseConfig',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: ''
      });
    });

    test('selection', async () => {
      const action = vi.fn();
      renderSelect({ query: { dbName: 'test' } }, action);
      await SelectUtil.assertOptionsCount(3);
      await userEvent.click(screen.getByRole('button', { name: 'Open Database Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openDatabaseConfig',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: '{"project":"project1"}'
      });
    });
  });

  describe('newDatabaseConfig', () => {
    test('no selection', async () => {
      const action = vi.fn();
      renderSelect(undefined, action);
      await userEvent.click(screen.getByRole('button', { name: 'Create new Database Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'newDatabaseConfig',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: ''
      });
    });

    test('selection', async () => {
      const action = vi.fn();
      renderSelect({ query: { dbName: 'test' } }, action);
      await SelectUtil.assertOptionsCount(3);
      await userEvent.click(screen.getByRole('button', { name: 'Create new Database Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'newDatabaseConfig',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: ''
      });
    });
  });
});
