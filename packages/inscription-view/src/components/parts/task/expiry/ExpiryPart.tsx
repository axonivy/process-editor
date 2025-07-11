import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathFieldset } from '../../common/path/PathFieldset';
import { ResponsiblePart } from '../../common/responsible/ResponsiblePart';
import { PriorityPart } from '../priority/PriorityPart';
import ErrorSelect from './ErrorSelect';
import { useExpiryData } from './useExpiryData';

const ExpiryPart = () => {
  const { t } = useTranslation();
  const { expiry, update, updateResponsible, updatePriority } = useExpiryData();
  const isTimeoutDefined = expiry.timeout.length > 0;
  return (
    <PathCollapsible label={t('label.expiry')} defaultOpen={isTimeoutDefined} path='expiry'>
      <PathFieldset label={t('label.timeout')} path='timeout'>
        <ScriptInput
          value={expiry.timeout}
          onChange={change => update('timeout', change)}
          type={IVY_SCRIPT_TYPES.DURATION}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
      {isTimeoutDefined && (
        <>
          <ErrorSelect value={expiry.error} onChange={change => update('error', change)} />
          <ResponsiblePart responsible={expiry.responsible} updateResponsible={updateResponsible} />
          <PriorityPart priority={expiry.priority} updatePriority={updatePriority} />
        </>
      )}
    </PathCollapsible>
  );
};

export default ExpiryPart;
