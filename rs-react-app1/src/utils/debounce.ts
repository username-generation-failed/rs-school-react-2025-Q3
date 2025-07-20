export const debounce = <T extends (...args: unknown[]) => unknown>(
  ms: number,
  func: T
) => {
  let timerId: number | undefined;
  function withDebounce(this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(func.bind(this, ...args), ms);
  }

  return withDebounce;
};
