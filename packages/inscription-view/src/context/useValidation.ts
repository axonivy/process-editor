import type { SchemaKeys, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import { useDataContext } from './useDataContext';
import { useFullPath, usePath } from './usePath';

export function useValidations(paths?: SchemaKeys[]): ValidationResult[] {
  const { validations } = useDataContext();
  const fullLocation = useFullPath(paths);
  return validations.filter(val => val.path.startsWith(fullLocation));
}

export function useValidation(): ValidationResult | undefined {
  const { validations } = useDataContext();
  const location = usePath();
  return validations.find(val => val.path === location);
}
