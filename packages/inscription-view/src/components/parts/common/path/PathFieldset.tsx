import type { SchemaKeys } from '@axonivy/process-editor-inscription-protocol';
import type { ReactNode } from 'react';
import { PathContext } from '../../../../context/usePath';
import type { FieldsetProps } from '../../../widgets/fieldset/Fieldset';
import { ValidationFieldset } from './validation/ValidationFieldset';

export type PathFieldsetProps = FieldsetProps & {
  path: SchemaKeys;
  children: ReactNode;
};

export const PathFieldset = ({ path: location, children, ...props }: PathFieldsetProps) => (
  <PathContext path={location}>
    <ValidationFieldset {...props}>{children}</ValidationFieldset>
  </PathContext>
);
