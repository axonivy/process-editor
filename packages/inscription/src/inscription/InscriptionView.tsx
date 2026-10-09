import { App } from '@axonivy/process-editor-inscription-view';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { useMove } from 'react-aria';
import { inscriptionWidthStorage } from './inscription-width-storage';

const InscriptionView = ({ pid, ...props }: ComponentProps<typeof App>) => {
  const keyboardResizeStep = 20;
  const [element, setElement] = useState(pid);
  useEffect(() => {
    setElement(pid);
  }, [pid]);

  const [width, setWidth] = useState(inscriptionWidthStorage().getWidth());
  const [resizeActive, setResizeActive] = useState(false);
  const { moveProps } = useMove({
    onMoveStart() {
      setResizeActive(true);
    },
    onMove(e) {
      const deltaX = e.pointerType === 'keyboard' ? e.deltaX * keyboardResizeStep : e.deltaX;
      setWidth(oldWidth => {
        const newWidth = inscriptionWidthStorage().fixWidth(oldWidth - deltaX);
        inscriptionWidthStorage().setWidth(newWidth);
        return newWidth;
      });
      window.dispatchEvent(new CustomEvent('resize'));
    },
    onMoveEnd() {
      setResizeActive(false);
    }
  });
  return (
    <div style={{ width: width }}>
      <div tabIndex={0} className={`inscription-resizer${resizeActive ? ' active' : ''}`} {...moveProps} />
      <App pid={element} {...props} />
    </div>
  );
};

export default InscriptionView;
