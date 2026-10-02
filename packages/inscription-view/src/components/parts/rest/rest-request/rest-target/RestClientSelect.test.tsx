import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen, SelectUtil, userEvent, type DeepPartial } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import { RestClientSelect } from './RestClientSelect';

describe('RestClientSelect', () => {
  function renderSelect(data?: DeepPartial<RestRequestData>, action?: () => void) {
    const restClients = [
      { clientId: '0', name: 'fake', iconUrl: '', project: 'project0' },
      { clientId: '1234', name: 'personService', iconUrl: '', project: 'project1' }
    ];
    customRender(<RestClientSelect />, {
      wrapperProps: {
        data: data && { config: data },
        elementContext: { app: '', pid: '', project: 'baseProject' },
        action,
        meta: { restClients }
      }
    });
  }

  test('render', async () => {
    renderSelect();
    await SelectUtil.assertEmpty();
    await SelectUtil.assertOptionsCount(2);
  });

  test('unknown value', async () => {
    renderSelect({ target: { clientId: 'unknown' } });
    await SelectUtil.assertValue('unknown');
  });

  test('known value', async () => {
    renderSelect({ target: { clientId: '1234' } });
    await SelectUtil.assertValue('personService');
  });

  describe('openRestConfig', () => {
    test('no selection', async () => {
      const action = vi.fn();
      renderSelect(undefined, action);
      await userEvent.click(screen.getByRole('button', { name: 'Open Rest config' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openRestConfig',
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
      renderSelect({ target: { clientId: '1234' } }, action);
      await SelectUtil.assertValue('personService');
      await userEvent.click(screen.getByRole('button', { name: 'Open Rest config' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openRestConfig',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: '{"project":"project1"}'
      });
    });
  });

  describe('newRestClient', () => {
    test('no selection', async () => {
      const action = vi.fn();
      renderSelect(undefined, action);
      await userEvent.click(screen.getByRole('button', { name: 'Create new Rest Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'newRestClient',
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
      renderSelect({ target: { clientId: '1234' } }, action);
      await SelectUtil.assertValue('personService');
      await userEvent.click(screen.getByRole('button', { name: 'Create new Rest Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'newRestClient',
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
