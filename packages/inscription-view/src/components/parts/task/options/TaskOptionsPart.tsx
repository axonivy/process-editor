import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationFieldset } from '../../common/path/validation/ValidationFieldset';
import { useTaskData } from '../useTaskData';

const TaskOptionsPart = () => {
  const { t } = useTranslation();
  const { task, update } = useTaskData();
  return (
    <PathCollapsible label={t('part.task.options')} defaultOpen={task.skipTasklist} path='delay'>
      <Checkbox label={t('part.task.skipTasklist')} value={task.skipTasklist} onChange={change => update('skipTasklist', change)} />
      <ValidationFieldset label={t('part.task.delay')}>
        <ScriptInput
          value={task.delay}
          onChange={change => update('delay', change)}
          browsers={['attr', 'func', 'type']}
          type={IVY_SCRIPT_TYPES.DURATION}
        />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export default TaskOptionsPart;
