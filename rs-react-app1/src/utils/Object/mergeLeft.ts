import type { IsPartial, Values } from '~utils/types';

type MergeLeft<A extends object, B extends object> = {
  [K in keyof A as K extends keyof B
    ? IsPartial<B, K> extends true
      ? K
      : never
    : K]: K extends keyof B
    ? IsPartial<A, K> extends true
      ? B[K]
      : A[K]
    : A[K];
} & {
  [K in keyof B as IsPartial<B, K> extends false ? K : never]-?: B[K];
};

export const mergeLeft = <A extends object, B extends object>(
  a: A,
  b: B
): MergeLeft<A, B> => {
  const result = { ...a };

  Object.keys(b).forEach((key) => {
    result[key as keyof A] = (result[key as keyof A] ??
      b[key as keyof B]) as Values<A>;
  });

  return result as MergeLeft<A, B>;
};
