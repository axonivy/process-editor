import { memo } from 'react';
import MappingTree from './MappingTree';
import type { SchemaKeys, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { useTableGlobalFilter, useTableOnlyInscribed } from './useMappingTree';
import { PathCollapsible } from '../path/PathCollapsible';
import type { BrowserType } from '../../../browser/useBrowser';
import { PathContext } from '../../../../context/usePath';
import Fieldset from '../../../widgets/fieldset/Fieldset';
import { useTranslation } from 'react-i18next';

export type MappingPartProps = {
  data: Record<string, string>;
  variableInfo: VariableInfo;
  onChange: (change: Record<string, string>) => void;
  path?: SchemaKeys;
  browsers: BrowserType[];
};

const MappingPart = ({ path, data, ...props }: MappingPartProps) => {
  const { t } = useTranslation();
  const globalFilter = useTableGlobalFilter();
  const onlyInscribedFilter = useTableOnlyInscribed();
  return (
    <PathCollapsible
      label={t('common.label.mapping')}
      controls={[globalFilter.control, onlyInscribedFilter.control]}
      path={path ?? 'map'}
      defaultOpen={Object.keys(data).length > 0}
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
