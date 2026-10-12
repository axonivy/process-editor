export const inscriptionWidthStorage = () => {
  const inscriptionWidthKey = 'inscription-view-width';
  const getDefaultWidth = () => {
    let width = window.innerWidth / 3;
    if (width > 600) {
      width = 600;
    }
    return fixWidth(width);
  };

  const fixWidth = (newWidth: number) => {
    if (newWidth > window.innerWidth - 250) {
      return window.innerWidth - 250;
    }
    if (newWidth < 200) {
      return 200;
    }
    return newWidth;
  };

  const setWidth = (width: number) => {
    try {
      localStorage.setItem(inscriptionWidthKey, `${width}`);
    } catch (e) {
      console.warn("couldn't save width to localStorage", e);
    }
  };

  const getWidth = () => {
    let width = getDefaultWidth();
    try {
      width = Number(localStorage.getItem(inscriptionWidthKey) ?? width);
    } catch (e) {
      console.warn("couldn't load width from localStorage", e);
    }
    return fixWidth(width);
  };

  return { setWidth, getWidth, getDefaultWidth, fixWidth };
};
