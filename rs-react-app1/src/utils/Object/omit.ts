import pick from './pick';
import type { KeysArray } from './types';

export const omit = <O extends object, K extends KeysArray<O>>(
  target: O,
  keys: K
): Omit<O, K[number]> => {
  const restKeys = Object.keys(target).filter(
    (k) => !keys.includes(k as keyof O)
  );

  return pick(target, restKeys as KeysArray<O>);
};

export default omit;
