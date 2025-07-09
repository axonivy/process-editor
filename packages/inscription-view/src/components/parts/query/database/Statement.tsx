import { Message } from '@axonivy/ui-components';
import { useQueryData } from '../useQueryData';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { PathFieldset } from '../../common/path/PathFieldset';
import { MacroArea } from '../../../widgets/code-editor/MacroArea';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { IvyIcons } from '@axonivy/ui-icons';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';

export const Statement = () => {
  const { config, defaultConfig, updateSql } = useQueryData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathCollapsible
      label='Definition'
      defaultOpen={config.query.sql.stmt !== defaultConfig.query.sql.stmt || config.query.sql.quote !== defaultConfig.query.sql.quote}
      path='sql'
      controls={[maximizeCode]}
    >
      <PathFieldset label='SQL Query' path='stmt'>
        <MacroArea
          value={config.query.sql.stmt}
          onChange={change => updateSql('stmt', change)}
          browsers={['tablecol', 'attr']}
          maximizeState={maximizeState}
          maximizedHeader={{ title: 'Definition', icon: IvyIcons.Database }}
        />
      </PathFieldset>
      <Message
        message='The use of "any query" can lead to SQL injection vulnerabilities. See the "help" docs for more information.'
        variant='warning'
      />
      <Checkbox label='Quote ivyScript variables' value={config.query.sql.quote} onChange={change => updateSql('quote', change)} />
    </PathCollapsible>
  );
};
