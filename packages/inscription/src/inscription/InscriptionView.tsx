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
  const resizeTo = (newWidth: number) => {
    const storage = inscriptionWidthStorage();
    const fixedWidth = storage.fixWidth(newWidth);
    setWidth(fixedWidth);
    storage.setWidth(fixedWidth);
    setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 0);
  };
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
  const toggleWidth = () => {
    const storage = inscriptionWidthStorage();
    const maximizedWidth = storage.fixWidth((window.innerWidth * 2) / 3);
    resizeTo(width === maximizedWidth ? storage.getDefaultWidth() : maximizedWidth);
  };
  return (
    <div style={{ width: width }}>
      <div
        role='separator'
        aria-orientation='vertical'
        tabIndex={0}
        className={`inscription-resizer${resizeActive ? ' active' : ''}`}
        {...moveProps}
        onDoubleClick={toggleWidth}
      />
      <App pid={element} {...props} />
    </div>
  );
};

export default InscriptionView;
