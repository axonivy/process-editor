import type { SchemaKeys, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { deepEqual } from '@axonivy/ui-components';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PathProvider } from '../../../../context/usePath';
import type { BrowserType } from '../../../browser/useBrowser';
import Fieldset from '../../../widgets/fieldset/Fieldset';
import { PathCollapsible } from '../path/PathCollapsible';
import MappingTree from './MappingTree';
import { useMappingTree, useTableGlobalFilter, useTableOnlyInscribed } from './useMappingTree';

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
  const tree = useMappingTree(data, props.variableInfo, props.onChange, props.browsers);
  const globalFilter = useTableGlobalFilter(tree);
  const onlyInscribedFilter = useTableOnlyInscribed(tree);
  return (
    <PathCollapsible
      label={t('common.label.mapping')}
      controls={[globalFilter.control, onlyInscribedFilter.control]}
      path={path ?? 'map'}
      defaultOpen={defaultOpen ?? !deepEqual(data, defaultData)}
    >
      <MappingTree tree={tree} globalFilterActive={globalFilter.active} />
    </PathCollapsible>
  );
};

export const MappingField = ({ path, data, ...props }: MappingPartProps) => {
  const { t } = useTranslation();
  const tree = useMappingTree(data, props.variableInfo, props.onChange, props.browsers);
  const globalFilter = useTableGlobalFilter(tree);
  const onlyInscribedFilter = useTableOnlyInscribed(tree);
  return (
    <PathProvider path={path ?? 'map'}>
      <Fieldset label={t('common.label.mapping')} controls={[globalFilter.control, onlyInscribedFilter.control]}>
        <MappingTree tree={tree} globalFilterActive={globalFilter.active} />
      </Fieldset>
    </PathProvider>
  );
};

export default memo(MappingPart);
