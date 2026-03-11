import { RequestHistoryAction } from '@axonivy/process-editor-protocol';
import { BasicField, ButtonGroup, Popover, PopoverAnchor, PopoverContent, Spinner, type ButtonProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Bounds, IActionDispatcher } from '@eclipse-glsp/client';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryTree } from './HistoryTree';
import { PinnedHistory } from './PinnedHistory';
import { useHistoryPinnedState } from './useHistoryPinnedState';

type HistoryPopoverProps = Omit<HistoryProps, 'togglePinned'> & {
  containerElement: HTMLElement;
  bounds: Bounds;
};

export const HistoryPopover = ({ bounds, containerElement, ...props }: HistoryPopoverProps) => {
  const { pinned, togglePinned } = useHistoryPinnedState();

  const history = <HistoryContent togglePinned={togglePinned} {...props} />;
  if (pinned) {
    return <PinnedHistory>{history}</PinnedHistory>;
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
        onEscapeKeyDown={props.closeHistory}
      >
        {history}
      </PopoverContent>
    </Popover>
  );
};

type HistoryProps = {
  actionDispatcher: IActionDispatcher;
  app: string;
  pmv: string;
  pid: string;
  togglePinned: () => void;
  closeHistory: () => void;
};

export const HistoryContent = ({ actionDispatcher, togglePinned, closeHistory, ...props }: HistoryProps) => {
  const { t } = useTranslation();
  const [searchActive, setSearchActive] = useState(false);
  const query = useQuery({
    queryKey: ['process', 'history', props],
    queryFn: () => actionDispatcher.request(RequestHistoryAction.create({ elementId: props.pid }))
  });

  const successActions: Array<ButtonProps> = [
    {
      title: t('common.label.search'),
      'aria-label': t('common.label.search'),
      icon: IvyIcons.Search,
      toggle: searchActive,
      onClick: () => setSearchActive(show => !show)
    },
    {
      title: t('common.label.refresh'),
      'aria-label': t('common.label.refresh'),
      icon: IvyIcons.Reset,
      onClick: () => query.refetch()
    }
  ];

  return (
    <BasicField
      label={`History of '${props.pid}'`}
      control={
        <ButtonGroup
          controls={[
            ...(query.isSuccess ? successActions : []),
            {
              title: t('common.label.pin'),
              'aria-label': t('common.label.pin'),
              icon: IvyIcons.WindowMinimize,
              onClick: togglePinned
            },
            {
              title: t('common.label.close'),
              'aria-label': t('common.label.close'),
              icon: IvyIcons.Close,
              onClick: closeHistory
            }
          ]}
        />
      }
    >
      {query.isPending && <Spinner size='small' />}
      {query.isError && <div>{t('history.error')}</div>}
      {query.isSuccess && <HistoryTree data={query.data.historyNodes} searchActive={searchActive} />}
    </BasicField>
  );
};
