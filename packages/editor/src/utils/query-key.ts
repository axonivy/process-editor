export const genQueryKey = (...args: unknown[]) => {
  return ['process-editor', ...args];
};
