export const deAsync = <P extends unknown[]>(
  func: (...params: P) => unknown
) => {
  const withDeAsync = (...params: P) => {
    func(...params);
  };

  return withDeAsync;
};
