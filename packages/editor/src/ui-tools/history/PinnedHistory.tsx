import React, { type ReactNode } from 'react';
import { useResizablePinnedDimensions } from './useResizablePinnedDimensions';

type PinnedHistoryProps = {
  children: ReactNode;
};

export const PinnedHistory = ({ children }: PinnedHistoryProps) => {
  const { dimensions, resizingEdge, topHandleProps, rightHandleProps, topRightHandleProps } = useResizablePinnedDimensions();

  return (
    <div
      className='history-pinned'
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      data-resizing={resizingEdge}
      data-resizing-edge={resizingEdge}
    >
      <div className='history-pinned-resizer-top' data-active={resizingEdge === 'top'} {...topHandleProps} />
      <div className='history-pinned-resizer-right' data-active={resizingEdge === 'right'} {...rightHandleProps} />
      <div className='history-pinned-resizer-top-right' data-active={resizingEdge === 'top-right'} {...topRightHandleProps} />
      {children}
    </div>
  );
};
