import CustomFieldTable from '../../common/customfield/CustomFieldTable';
import Information from '../../common/info/Information';
import TaskCode from '../code/TaskCode';
import { PriorityCollapsible } from '../priority/PriorityPart';
import { useTaskData } from '../useTaskData';

const WsTask = () => {
  const { task, defaultTask, update, updatePriority } = useTaskData();
  return (
    <>
      <Information config={task} defaultConfig={defaultTask} update={update} />
      <PriorityCollapsible priority={task.priority} updatePriority={updatePriority} />
      <CustomFieldTable data={task.customFields} onChange={change => update('customFields', change)} type='TASK' />
      <TaskCode />
    </>
  );
};

export default WsTask;
