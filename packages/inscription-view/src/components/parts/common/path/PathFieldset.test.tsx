import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import { Input } from '@axonivy/ui-components';
import { customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { PathFieldset } from './PathFieldset';

describe('PathFieldset', () => {
  function renderFieldset(validations: ValidationResult[]) {
    customRender(
      <PathFieldset label='Test Label' path='name'>
        <Input />
      </PathFieldset>,
      { wrapperProps: { validations } }
    );
  }

  test('validaiton wrong path', () => {
    renderFieldset([{ path: 'test', message: 'this is a error', severity: 'ERROR' }]);
    expect(screen.queryByText('this is a error')).not.toBeInTheDocument();

    renderFieldset([{ path: 'test.name', message: 'this is a error', severity: 'ERROR' }]);
    expect(screen.queryByText('this is a error')).not.toBeInTheDocument();

    renderFieldset([{ path: 'name.test', message: 'this is a error', severity: 'ERROR' }]);
    expect(screen.queryByText('this is a error')).not.toBeInTheDocument();
  });

  test('validations visible', () => {
    renderFieldset([{ path: 'name', message: 'this is a error', severity: 'ERROR' }]);
    expect(screen.getByTitle('this is a error')).toHaveClass('ui-message');
  });
});
