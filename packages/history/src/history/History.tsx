import { RequestHistoryAction } from '@axonivy/process-editor-protocol';
import { Spinner } from '@axonivy/ui-components';
import { type IActionDispatcher } from '@eclipse-glsp/client/lib/re-exports';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { HistoryTree } from './HistoryTree';

export const History = ({ actionDispatcher, elementId }: { actionDispatcher: IActionDispatcher; elementId: string }) => {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['process-history', elementId],
    queryFn: () => actionDispatcher.request(RequestHistoryAction.create({ elementId }))
  });

  if (query.isPending) {
    return <Spinner size='small' />;
  }

  if (query.isError) {
    return <div>{t('history.error')}</div>;
  }

  return <HistoryTree elementId={elementId} data={query.data.historyNodes} />;
};
