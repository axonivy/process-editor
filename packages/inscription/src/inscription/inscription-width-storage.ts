export const inscriptionWidthStorage = () => {
  const inscriptionWidthKey = 'inscription-view-width';
  const fixWidth = (newWidth: number) => {
    if (newWidth > window.innerWidth - 250) {
      return window.innerWidth - 250;
    }
    if (newWidth < 250) {
      return 250;
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
    let width = window.innerWidth / 3;
    if (width > 600) {
      width = 600;
    }
    try {
      width = Number(localStorage.getItem(inscriptionWidthKey) ?? width);
    } catch (e) {
      console.warn("couldn't load width from localStorage", e);
    }
    return fixWidth(width);
  };

  return { setWidth, getWidth, fixWidth };
};
