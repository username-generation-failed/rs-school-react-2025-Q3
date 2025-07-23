type typeofReturnType =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';

type TM = {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: symbol;
  undefined: undefined;
  object: object;
  function: (...params: unknown[]) => unknown;
};

export const guard =
  <T>() =>
  <C extends typeofReturnType>(
    value: unknown,
    castAs: C,
    predicate: (value: TM[C]) => boolean
  ): value is T => {
    return typeof value === castAs && predicate(value as TM[C]);
  };
