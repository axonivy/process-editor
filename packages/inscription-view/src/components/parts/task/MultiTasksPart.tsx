import type { TaskData } from '@axonivy/process-editor-inscription-protocol';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Task from './task/Task';
import { useValidations } from '../../../context/useValidation';
import { Tabs, type Tab } from '../../widgets/tab/Tab';
import { mergePaths, PathContext } from '../../../context/usePath';
import { TaskDataContextInstance, useConfigDataContext } from '../../../context/useDataContext';
import EmptyWidget from '../../widgets/empty/EmptyWidget';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMultiTasksPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useConfigDataContext();
  const validations = useValidations(['tasks']);
  const compareData = (data: TaskData) => [data.tasks];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Tasks',
    name: t('part.task.tasks'),
    state,
    content: <MultiTasksPart />,
    icon: IvyIcons.UserTask
  };
}

const MultiTasksPart = () => {
  const { t } = useTranslation();
  const { config } = useConfigDataContext();
  const validations = useValidations(['tasks']);

  const tabs: Tab[] =
    config.tasks?.map<Tab>((task, index) => {
      const taskId = task.id ?? '';
      const taskVals = validations.filter(val => val.path.startsWith(mergePaths('tasks', [index])));
      return {
        id: taskId,
        name: taskId,
        messages: taskVals,
        content: (
          <PathContext path='tasks'>
            <TaskDataContextInstance.Provider value={index}>
              <PathContext path={index}>
                <Task />
              </PathContext>
            </TaskDataContextInstance.Provider>
          </PathContext>
        )
      };
    }) ?? [];

  if (tabs.length === 0) {
    return <EmptyWidget message={t('part.task.noTaskMessage')} />;
  }
  return <Tabs tabs={tabs} />;
};
