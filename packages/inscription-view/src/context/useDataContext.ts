import type { ConfigData, ElementData, ValidationResult, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { createContext, useCallback, useContext } from 'react';
import type { UpdateConsumer } from '../types/lambda';

export interface DataContext {
  data: ElementData;
  setData: UpdateConsumer<ElementData>;
  defaultData: ConfigData;
  initData: ElementData;
  validations: ValidationResult[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultDataContext: any = undefined;

export const DataContextInstance = createContext<DataContext>(defaultDataContext);
export const useDataContext = (): DataContext => useContext(DataContextInstance);

export type ConfigDataContext<T> = {
  config: T;
  defaultConfig: T;
  initConfig: T;
};

export function useConfigDataContext<T extends ConfigData>(): ConfigDataContext<T> & {
  setConfig: UpdateConsumer<ConfigData>;
} {
  const { data, initData, defaultData, setData } = useDataContext();

  const setConfig = useCallback<UpdateConsumer<ConfigData>>(
    update =>
      setData(
        produce(draft => {
          draft.config = update(draft.config);
        })
      ),
    [setData]
  );

  return { config: data.config as T, initConfig: initData.config as T, defaultConfig: defaultData as T, setConfig };
}

export const TaskDataContextInstance = createContext<number | undefined>(undefined);

export type TaskDataContext = {
  task: WfTask;
  defaultTask: WfTask;
  initTask: WfTask;
};

export function useTaskDataContext(): TaskDataContext & {
  setTask: UpdateConsumer<WfTask>;
} {
  const taskNumber = useContext(TaskDataContextInstance);
  const { config, defaultConfig, initConfig, setConfig } = useConfigDataContext();

  const setTask = useCallback<UpdateConsumer<WfTask>>(
    update =>
      setConfig(
        produce(draft => {
          if (taskNumber !== undefined && draft.tasks[taskNumber]) {
            draft.tasks[taskNumber] = update(draft.tasks[taskNumber]);
          } else {
            draft.task = update(draft.task);
          }
        })
      ),
    [setConfig, taskNumber]
  );

  let task = config.task;
  if (taskNumber !== undefined && config.tasks[taskNumber]) {
    task = config.tasks[taskNumber];
  }
  let defaultTask = defaultConfig.task;
  if (taskNumber !== undefined && defaultConfig.tasks[taskNumber]) {
    defaultTask = defaultConfig.tasks[taskNumber];
  }
  let initTask = initConfig.task;
  if (taskNumber !== undefined && initConfig.tasks[taskNumber]) {
    initTask = initConfig.tasks[taskNumber];
  }
  return { task, defaultTask, initTask, setTask };
}
