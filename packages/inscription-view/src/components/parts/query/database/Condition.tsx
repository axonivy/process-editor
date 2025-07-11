import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../../context/usePath';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';
import { MacroArea } from '../../../widgets/code-editor/MacroArea';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { useQueryData } from '../useQueryData';

export const Condition = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateSql } = useQueryData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='sql'>
      <PathCollapsible
        label={t('label.condition')}
        controls={[maximizeCode]}
        defaultOpen={config.query.sql.condition !== defaultConfig.query.sql.condition && config.query.sql.condition !== undefined}
        path='condition'
      >
        <ValidationFieldset>
          <MacroArea
            value={config.query.sql.condition}
            onChange={change => updateSql('condition', change)}
            browsers={['tablecol', 'attr']}
            maximizeState={maximizeState}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </PathContext>
  );
};
