export const isElectron = (): boolean => {
  if ('electron' in window) {
    return true;
  }
  return false;
};
