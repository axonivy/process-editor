import type { SchemaKeys, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { deepEqual } from '@axonivy/ui-components';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../../context/usePath';
import type { BrowserType } from '../../../browser/useBrowser';
import Fieldset from '../../../widgets/fieldset/Fieldset';
import { PathCollapsible } from '../path/PathCollapsible';
import MappingTree from './MappingTree';
import { useTableGlobalFilter, useTableOnlyInscribed } from './useMappingTree';

export type MappingPartProps = {
  data: Record<string, string>;
  variableInfo: VariableInfo;
  onChange: (change: Record<string, string>) => void;
  browsers: BrowserType[];
  path?: SchemaKeys;
  defaultOpen?: boolean;
};

const MappingPart = ({ path, data, defaultData, defaultOpen, ...props }: MappingPartProps & { defaultData: Record<string, string> }) => {
  const { t } = useTranslation();
  const globalFilter = useTableGlobalFilter();
  const onlyInscribedFilter = useTableOnlyInscribed();
  return (
    <PathCollapsible
      label={t('common.label.mapping')}
      controls={[globalFilter.control, onlyInscribedFilter.control]}
      path={path ?? 'map'}
      defaultOpen={defaultOpen ?? !deepEqual(data, defaultData)}
    >
      <MappingTree data={data} {...props} globalFilter={globalFilter} onlyInscribedFilter={onlyInscribedFilter} />
    </PathCollapsible>
  );
};

export const MappingField = ({ path, data, ...props }: MappingPartProps) => {
  const { t } = useTranslation();
  const globalFilter = useTableGlobalFilter();
  const onlyInscribedFilter = useTableOnlyInscribed();
  return (
    <PathContext path={path ?? 'map'}>
      <Fieldset label={t('common.label.mapping')} controls={[globalFilter.control, onlyInscribedFilter.control]}>
        <MappingTree data={data} {...props} globalFilter={globalFilter} onlyInscribedFilter={onlyInscribedFilter} />
      </Fieldset>
    </PathContext>
  );
};

export default memo(MappingPart);
