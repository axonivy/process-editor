import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { PathFieldset } from '../../common/path/PathFieldset';
import { ValidationCollapsible } from '../../common/path/validation/ValidationCollapsible';
import { useQueryData } from '../useQueryData';

export const Limit = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = useQueryData();
  return (
    <ValidationCollapsible
      label={t('part.db.limit')}
      defaultOpen={config.query.limit !== defaultConfig.query.limit || config.query.offset !== defaultConfig.query.offset}
      paths={['limit', 'offset']}
    >
      <PathFieldset label={t('part.db.lotSize')} path='limit'>
        <ScriptInput
          value={config.query.limit}
          onChange={change => update('limit', change)}
          type={IVY_SCRIPT_TYPES.NUMBER}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
      <PathFieldset label={t('part.db.startIndex')} path='offset'>
        <ScriptInput
          value={config.query.offset}
          onChange={change => update('offset', change)}
          type={IVY_SCRIPT_TYPES.NUMBER}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
    </ValidationCollapsible>
  );
};
