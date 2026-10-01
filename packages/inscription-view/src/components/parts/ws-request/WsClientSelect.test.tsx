import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, screen, SelectUtil, userEvent } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import { WsClientSelect } from './WsClientSelect';

describe('WsClientSelect', () => {
  function renderPart(data?: DeepPartial<WsRequestData>, action?: () => void) {
    customRender(<WsClientSelect />, {
      wrapperProps: {
        data: data && { config: data },
        elementContext: { app: '', pid: '', project: 'baseProject' },
        action,
        meta: {
          wsClients: [
            { clientId: 'client1', name: 'Super', iconUrl: '', project: 'project0' },
            { clientId: 'name', name: 'soaper', iconUrl: '', project: 'project1' }
          ]
        }
      }
    });
  }

  test('empty', async () => {
    renderPart();
    await SelectUtil.assertEmpty({ label: 'Client' });
  });

  test('unknown', async () => {
    renderPart({ clientId: 'unknown' });
    await SelectUtil.assertValue('unknown');
    await SelectUtil.assertOptionsCount(3);
  });

  test('data', async () => {
    renderPart({ clientId: 'name' });
    await SelectUtil.assertValue('soaper');
    await SelectUtil.assertOptionsCount(2);
  });

  describe('openWsConfig', () => {
    test('no selection', async () => {
      const action = vi.fn();
      renderPart(undefined, action);
      await userEvent.click(screen.getByRole('button', { name: 'Open WebService config' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openWsConfig',
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
      renderPart({ clientId: 'name' }, action);
      await SelectUtil.assertValue('soaper');
      await userEvent.click(screen.getByRole('button', { name: 'Open WebService config' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'openWsConfig',
        context: {
          app: '',
          pid: '',
          project: 'baseProject'
        },
        payload: '{"project":"project1"}'
      });
    });
  });

  describe('newWebServiceClient', () => {
    test('no selection', async () => {
      const action = vi.fn();
      renderPart(undefined, action);
      await userEvent.click(screen.getByRole('button', { name: 'Create new WebService Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'newWebServiceClient',
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
      renderPart({ clientId: 'name' }, action);
      await SelectUtil.assertValue('soaper');
      await userEvent.click(screen.getByRole('button', { name: 'Create new WebService Client' }));
      expect(action).toHaveBeenCalledWith({
        actionId: 'newWebServiceClient',
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
