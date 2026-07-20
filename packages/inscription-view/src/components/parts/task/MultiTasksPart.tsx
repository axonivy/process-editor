import type { TaskData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import Task from './task/Task';
import { useMutliTaskData } from './useTaskData';
import { useValidations } from '../../../context/useValidation';
import { Tabs, type Tab } from '../../widgets/tab/Tab';
import { mergePaths, PathContext } from '../../../context/usePath';
import { TaskDataContextInstance } from '../../../context/useDataContext';
import EmptyWidget from '../../widgets/empty/EmptyWidget';
import { useState } from 'react';

export function useMultiTasksPart(): PartProps {
  const { config, defaultConfig, initConfig, resetTasks } = useMutliTaskData();
  const validations = useValidations(['tasks']);
  const compareData = (data: TaskData) => [data.tasks];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Tasks', state, reset: { dirty, action: () => resetTasks() }, content: <MultiTasksPart /> };
}

const MultiTasksPart = () => {
  const { config } = useMutliTaskData();
  const validations = useValidations(['tasks']);

  const [activeTab, setActiveTab] = useState('');

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

  const onTabChange = (nextTab: string) => {
    const activeElement = document.activeElement;
    const isTabNavigationElement =
      activeElement instanceof HTMLElement &&
      (activeElement.getAttribute('role') === 'tab' || activeElement.closest('[role="tablist"]') !== null);
    if (activeElement instanceof HTMLElement && !isTabNavigationElement) {
      activeElement.blur();
    }
    setActiveTab(nextTab);
  };

  const selectedTab = tabs.some(tab => tab.id === activeTab) ? activeTab : (tabs[0]?.id ?? '');

  return (
    <>
      {tabs.length > 0 ? (
        <Tabs tabs={tabs} value={selectedTab} onChange={onTabChange} />
      ) : (
        <EmptyWidget message='There is no (Task) output flow connected.' />
      )}
    </>
  );
};
