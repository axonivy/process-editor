import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test, vi } from 'vitest';
import Information from './Information';

describe('Information', () => {
  function renderPart(action?: () => void) {
    const config = { name: '', description: '', category: '' };
    customRender(<Information config={config} defaultConfig={config} update={() => {}} />, {
      wrapperProps: {
        elementContext: { app: '', pid: '', project: 'baseProject' },
        action
      }
    });
  }

  test('openCms', async () => {
    const action = vi.fn();
    renderPart(action);
    await userEvent.click(screen.getByRole('button', { name: 'Open CMS Editor' }));
    expect(action).toHaveBeenCalledWith({
      actionId: 'openCms',
      context: {
        app: '',
        pid: '',
        project: 'baseProject'
      },
      payload: ''
    });
  });
});
