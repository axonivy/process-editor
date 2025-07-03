import { useTranslation } from 'react-i18next';
import { usePartState, type PartProps } from '../../../components/editors/part/usePart';
import Checkbox from '../../widgets/checkbox/Checkbox';
import Collapsible from '../../widgets/collapsible/Collapsible';
import { usePermissionsData } from './usePermissionsData';
import type { PermissionsData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';

export function usePermissionsPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = usePermissionsData();
  const compareData = (data: PermissionsData) => [data.permissions];
  const state = usePartState(compareData(defaultConfig), compareData(config), []);
  return {
    id: 'Permissions',
    name: t('part.permission.title'),
    state,
    content: <PermissionsPart />,
    icon: IvyIcons.Permission
  };
}

const PermissionsPart = () => {
  const { t } = useTranslation();
  const { config, update } = usePermissionsData();
  return (
    <Collapsible label={t('part.permission.title')} defaultOpen={true}>
      <Checkbox
        label={t('part.permission.allowProcessViewer')}
        value={config.permissions.view.allowed}
        onChange={change => update('allowed', change)}
      />
    </Collapsible>
  );
};
