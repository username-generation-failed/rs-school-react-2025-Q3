export const remove = <T>(arr: T[], value: T): number => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return index;
};
