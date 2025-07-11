import { IvyIcons } from '@axonivy/ui-icons';
import type { FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useDataContext } from '../../../context/useDataContext';
import IvyIcon from '../IvyIcon';
import './ErrorFallback.css';

const ErrorFallback = (props: FallbackProps) => {
  const { t } = useTranslation();
  const { data } = useDataContext();
  return (
    <div className='error-fallback' role='alert'>
      <div className='error-fallback-msg'>
        <h3>
          <IvyIcon icon={IvyIcons.Error} />
          {t('message.boundaryTitle')}
        </h3>
        <pre>{props.error.message}</pre>
      </div>
      <div className='error-fallback-data'>
        <h5>
          <IvyIcon icon={IvyIcons.InfoCircle} />
          {t('message.boundaryData')}
        </h5>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ErrorFallback;
