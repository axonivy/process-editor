import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

const HISTORY_PINNED_DIMENSIONS_STORAGE_KEY = 'process-editor.history.pinned.dimensions';

type Dimensions = {
  width: number;
  height: number;
};

type ResizeEdge = 'top' | 'right' | 'top-right' | null;

type ResizeStart = {
  edge: Exclude<ResizeEdge, null>;
  pointerX: number;
  pointerY: number;
  width: number;
  height: number;
};

const DEFAULT_DIMENSIONS: Dimensions = {
  width: 500,
  height: 200
};

const MIN_WIDTH = 250;
const MIN_HEIGHT = 180;
const VIEWPORT_MARGIN = 24;

const clampDimensions = (dimensions: Dimensions): Dimensions => {
  if (typeof window === 'undefined') {
    return {
      width: Math.max(MIN_WIDTH, dimensions.width),
      height: Math.max(MIN_HEIGHT, dimensions.height)
    };
  }

  const maxWidth = Math.max(MIN_WIDTH, window.innerWidth - VIEWPORT_MARGIN);
  const maxHeight = Math.max(MIN_HEIGHT, window.innerHeight - VIEWPORT_MARGIN);

  return {
    width: Math.max(MIN_WIDTH, Math.min(maxWidth, dimensions.width)),
    height: Math.max(MIN_HEIGHT, Math.min(maxHeight, dimensions.height))
  };
};

const readStoredDimensions = (): Dimensions => {
  try {
    const rawValue = window.localStorage.getItem(HISTORY_PINNED_DIMENSIONS_STORAGE_KEY);
    if (!rawValue) {
      return DEFAULT_DIMENSIONS;
    }

    const storedValue = JSON.parse(rawValue) as Partial<Dimensions>;
    if (typeof storedValue.width !== 'number' || typeof storedValue.height !== 'number') {
      return DEFAULT_DIMENSIONS;
    }

    return clampDimensions({ width: storedValue.width, height: storedValue.height });
  } catch {
    return DEFAULT_DIMENSIONS;
  }
};

export const useResizablePinnedDimensions = () => {
  const [dimensions, setDimensions] = useState<Dimensions>(() => readStoredDimensions());
  const [resizingEdge, setResizingEdge] = useState<ResizeEdge>(null);
  const resizeStartRef = useRef<ResizeStart | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(HISTORY_PINNED_DIMENSIONS_STORAGE_KEY, JSON.stringify(dimensions));
    } catch {
      // Ignore storage failures (e.g. private mode).
    }
  }, [dimensions]);

  useEffect(() => {
    if (!resizingEdge) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const start = resizeStartRef.current;
      if (!start) {
        return;
      }

      const deltaX = event.clientX - start.pointerX;
      const deltaY = event.clientY - start.pointerY;

      const nextDimensions =
        start.edge === 'top'
          ? { width: start.width, height: start.height - deltaY }
          : start.edge === 'right'
            ? { width: start.width + deltaX, height: start.height }
            : { width: start.width + deltaX, height: start.height - deltaY };

      setDimensions(clampDimensions(nextDimensions));
      window.dispatchEvent(new CustomEvent('resize'));
    };

    const stopResizing = () => {
      setResizingEdge(null);
      resizeStartRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResizing);
    window.addEventListener('pointercancel', stopResizing);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResizing);
      window.removeEventListener('pointercancel', stopResizing);
    };
  }, [resizingEdge]);

  const startResizing = (edge: Exclude<ResizeEdge, null>, event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    resizeStartRef.current = {
      edge,
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: dimensions.width,
      height: dimensions.height
    };
    setResizingEdge(edge);
  };

  return {
    dimensions,
    resizingEdge,
    topHandleProps: {
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => startResizing('top', event)
    },
    rightHandleProps: {
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => startResizing('right', event)
    },
    topRightHandleProps: {
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => startResizing('top-right', event)
    }
  };
};
