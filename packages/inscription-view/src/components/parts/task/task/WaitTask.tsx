import CustomFieldTable from '../../common/customfield/CustomFieldTable';
import Information from '../../common/info/Information';
import TaskCode from '../code/TaskCode';
import { useTaskData } from '../useTaskData';

const WaitTask = () => {
  const { task, defaultTask, update } = useTaskData();
  return (
    <>
      <Information config={task} defaultConfig={defaultTask} update={update} />
      <CustomFieldTable data={task.customFields} onChange={change => update('customFields', change)} type='TASK' />
      <TaskCode />
    </>
  );
};

export default WaitTask;
