import { RequestHistoryAction } from '@axonivy/process-editor-protocol';
import { Popover, PopoverAnchor, PopoverContent, Spinner } from '@axonivy/ui-components';
import type { Bounds, IActionDispatcher } from '@eclipse-glsp/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryTree, type HistoryTreeProps } from './HistoryTree';

const HISTORY_PINNED_STORAGE_KEY = 'process-editor.history.pinned';

type HistoryPopoverProps = {
  containerElement: HTMLElement;
  actionDispatcher: IActionDispatcher;
  elementId: string;
  bounds: Bounds;
  closeHistory: () => void;
};

export const HistoryPopover = ({ bounds, containerElement, actionDispatcher, elementId, closeHistory }: HistoryPopoverProps) => {
  const [pinned, setPinned] = useState(() => {
    try {
      return window.localStorage.getItem(HISTORY_PINNED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_PINNED_STORAGE_KEY, String(pinned));
    } catch {
      // Ignore storage failures (e.g. private mode).
    }
  }, [pinned]);

  const history = (
    <HistoryContent
      actionDispatcher={actionDispatcher}
      elementId={elementId}
      togglePinned={() => setPinned(value => !value)}
      closeHistory={closeHistory}
    />
  );
  if (pinned) {
    return <div className='history-pinned'>{history}</div>;
  }
  return (
    <Popover open={true}>
      <PopoverAnchor asChild>
        <div
          style={{
            top: `${bounds.y - 6}px`,
            left: `${bounds.x - 6}px`,
            height: `${bounds.height + 12}px`,
            width: `${bounds.width + 12}px`
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        side='bottom'
        align='center'
        sideOffset={10}
        collisionPadding={8}
        container={containerElement}
        collisionBoundary={containerElement}
        onEscapeKeyDown={closeHistory}
      >
        {history}
      </PopoverContent>
    </Popover>
  );
};

type HistoryProps = Omit<HistoryTreeProps, 'data'> & {
  actionDispatcher: IActionDispatcher;
};

export const HistoryContent = ({ actionDispatcher, ...props }: HistoryProps) => {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['process-history', props.elementId],
    queryFn: () => actionDispatcher.request(RequestHistoryAction.create({ elementId: props.elementId }))
  });

  if (query.isPending) {
    return <Spinner size='small' />;
  }

  if (query.isError) {
    return <div>{t('history.error')}</div>;
  }

  return <HistoryTree data={query.data.historyNodes} {...props} />;
};
