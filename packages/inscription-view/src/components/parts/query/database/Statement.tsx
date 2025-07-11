import { Message } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { MacroArea } from '../../../widgets/code-editor/MacroArea';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useQueryData } from '../useQueryData';

export const Statement = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateSql } = useQueryData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathCollapsible
      label={t('part.db.definition')}
      defaultOpen={config.query.sql.stmt !== defaultConfig.query.sql.stmt || config.query.sql.quote !== defaultConfig.query.sql.quote}
      path='sql'
      controls={[maximizeCode]}
    >
      <PathFieldset label={t('part.db.sqlQuery')} path='stmt'>
        <MacroArea
          value={config.query.sql.stmt}
          onChange={change => updateSql('stmt', change)}
          minHeight={250}
          browsers={['tablecol', 'attr']}
          maximizeState={maximizeState}
          maximizedHeader={{ title: t('part.db.sqlQuery'), icon: IvyIcons.Query }}
        />
      </PathFieldset>
      <Message
        message='The use of "any query" can lead to SQL injection vulnerabilities. See the "help" docs for more information.'
        variant='warning'
      />
      <Checkbox label={t('part.db.quoteIvyScript')} value={config.query.sql.quote} onChange={change => updateSql('quote', change)} />
    </PathCollapsible>
  );
};
