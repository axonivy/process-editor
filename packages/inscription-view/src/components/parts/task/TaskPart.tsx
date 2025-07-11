import type { WfTask } from '@axonivy/process-editor-inscription-protocol';
import { PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import type { TaskPersistData } from './options/usePersistOptionsData';
import { useTaskPersistData } from './options/usePersistOptionsData';
import RequestTask from './task/RequestTask';
import Task from './task/Task';
import WaitTask from './task/WaitTask';
import WsTask from './task/WsTask';
import { useTaskData } from './useTaskData';

export function useTaskPart(options?: TaskPartProps): PartProps {
  const { t } = useTranslation();
  const { task, defaultTask } = useTaskData();
  const { config, defaultConfig } = useTaskPersistData();
  let validations = useValidations(['task']);
  const isStartRequest = options?.type === 'request';
  if (isStartRequest) {
    validations = validations.filter(val => !val.path.startsWith('task.responsible')).filter(val => !val.path.startsWith('task.delay'));
  }
  const compareData = (task: WfTask, persist: TaskPersistData) => [task, isStartRequest ? persist.persistOnStart : ''];
  const state = usePartState(compareData(defaultTask, defaultConfig), compareData(task, config), validations);

  return {
    id: 'Task',
    name: t('part.task.task'),
    state,
    content: <TaskPart type={options?.type} />,
    icon: IvyIcons.UserTask
  };
}

export type TaskPartProps = {
  type?: 'request' | 'wait' | 'ws';
};

const TaskPart = ({ type }: TaskPartProps) => {
  const { t } = useTranslation();
  const { defaultTask } = useTaskData();
  const task = (type: TaskPartProps['type']) => {
    switch (type) {
      case 'request':
        return <RequestTask />;
      case 'wait':
        return <WaitTask />;
      case 'ws':
        return <WsTask />;
      default:
        return <Task />;
    }
  };
  if (defaultTask) {
    return <PathContext path='task'>{task(type)}</PathContext>;
  }
  return <PanelMessage icon={IvyIcons.UserTask} message={t('part.task.noTaskMessage')} />;
};
