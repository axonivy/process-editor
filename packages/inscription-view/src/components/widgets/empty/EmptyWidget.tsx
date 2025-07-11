import { IvyIcons } from '@axonivy/ui-icons';
import IvyIcon from '../IvyIcon';
import './EmptyWidget.css';

const EmptyWidget = (props: { message: string }) => {
  return (
    <div className='empty-widget' role='alert'>
      <p>
        <IvyIcon icon={IvyIcons.InfoCircle} />
        {props.message}
      </p>
    </div>
  );
};

export default EmptyWidget;
