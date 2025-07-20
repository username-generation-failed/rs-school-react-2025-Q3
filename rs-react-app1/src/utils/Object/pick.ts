import type { KeysArray } from './types';

export const pick = <O, K extends KeysArray<O>>(
  target: O,
  keys: K
): Pick<O, K[number]> => {
  const result = {} as Pick<O, K[number]>;

  keys.forEach((key) => {
    result[key] = target[key];
  });

  return result;
};

export default pick;
