import type { StartPermission } from '@axonivy/process-editor-inscription-protocol';
import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';
import MultipleRoleSelect from '../role/MultipleRoleSelect';
import { deepEqual } from '../../../../utils/equals';
import { PathFieldset } from '../path/PathFieldset';
import { PathCollapsible } from '../path/PathCollapsible';
import ExceptionSelect from '../exception-handler/ExceptionSelect';
import type { DataUpdater } from '../../../../types/lambda';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { useTranslation } from 'react-i18next';

interface PermissionProps {
  anonymousFieldActive: boolean;
  config: StartPermission;
  defaultConfig: StartPermission;
  updatePermission: DataUpdater<StartPermission>;
  defaultOpen?: boolean;
}

export const Permission = ({ anonymousFieldActive, config, defaultConfig, updatePermission, defaultOpen }: PermissionProps) => {
  const { t } = useTranslation();
  return (
    <PathCollapsible path='permission' label={t('label.permission')} defaultOpen={defaultOpen ?? !deepEqual(config, defaultConfig)}>
      {anonymousFieldActive && (
        <Checkbox label={t('label.allowAnonymous')} value={config.anonymous} onChange={change => updatePermission('anonymous', change)} />
      )}
      {(!anonymousFieldActive || (anonymousFieldActive && !config.anonymous)) && (
        <PathFieldset label={t('common.label.roles')} path='roles'>
          <MultipleRoleSelect value={config.roles} onChange={change => updatePermission('roles', change)} defaultRoles={[]} />
        </PathFieldset>
      )}
      <PathFieldset label={t('label.validationError')} path='error'>
        <ExceptionSelect
          value={config.error}
          onChange={change => updatePermission('error', change)}
          staticExceptions={[IVY_EXCEPTIONS.security, IVY_EXCEPTIONS.ignoreException]}
        />
      </PathFieldset>
    </PathCollapsible>
  );
};
