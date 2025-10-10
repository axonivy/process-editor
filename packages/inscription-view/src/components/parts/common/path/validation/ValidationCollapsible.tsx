import type { SchemaKeys } from '@axonivy/process-editor-inscription-protocol';
import { useMemo } from 'react';
import { useValidations } from '../../../../../context/useValidation';
import type { CollapsibleProps } from '../../../../widgets/collapsible/Collapsible';
import Collapsible from '../../../../widgets/collapsible/Collapsible';

export const ValidationCollapsible = ({ paths, children, ...props }: CollapsibleProps & { paths?: SchemaKeys[] }) => {
  const validations = useValidations();
  const pathValidations = useMemo(() => {
    if (paths) {
      const filteredValidations = [];
      for (const path of paths) {
        filteredValidations.push(...validations.filter(val => val.path.includes(path)));
      }
      return filteredValidations;
    }
    return validations;
  }, [paths, validations]);
  return (
    <Collapsible {...props} validations={pathValidations}>
      {children}
    </Collapsible>
  );
};
