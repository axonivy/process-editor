import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { InscriptionEditor } from './InscriptionEditor';

describe('Editor', () => {
  const renderEditor = (options: { headerState?: ValidationResult[] } = {}) =>
    customRender(<InscriptionEditor showOutline={false} setShowOutline={() => {}} />, {
      wrapperProps: { validations: options.headerState, editor: { title: 'Test Editor' } }
    });

  test('editor show messages', () => {
    const headerState: ValidationResult[] = [
      { path: '', message: 'this is an error', severity: 'ERROR' },
      { path: '', message: 'this is an warning', severity: 'WARNING' }
    ];
    renderEditor({ headerState: headerState });
    expect(screen.getByTitle(/this is an error/i)).toHaveAttribute('data-state', 'error');
    expect(screen.getByTitle(/this is an warning/i)).toHaveAttribute('data-state', 'warning');
  });

  test('editor do not show messages with path', () => {
    const headerState: ValidationResult[] = [{ path: 'output', message: 'message on output', severity: 'ERROR' }];
    renderEditor({ headerState: headerState });
    expect(screen.queryByTitle(/message on output/i)).not.toBeInTheDocument();
  });

  test('outline', async () => {
    const view = renderEditor();
    expect(screen.getByText('Test Editor')).toBeInTheDocument();
    expect(screen.getByRole('switch')).not.toBeChecked();
    expect(screen.queryByRole('row')).not.toBeInTheDocument();

    view.rerender(<InscriptionEditor showOutline={true} setShowOutline={() => {}} />);
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('row', { name: 'Process' })).toBeInTheDocument();
  });
});
