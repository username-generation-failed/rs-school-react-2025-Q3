import { useMemo } from 'react';
import { mergeLeft } from '~utils/Object';

export const useDefaultProps = <A extends object, B extends object>(
  props: A,
  defaultProps: B
) => {
  const result = useMemo(
    () => mergeLeft(props, defaultProps),
    [props, defaultProps]
  );

  return result;
};
