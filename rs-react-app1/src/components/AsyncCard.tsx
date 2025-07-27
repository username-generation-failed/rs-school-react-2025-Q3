import type { AsyncState } from '~lib/types';
import { is } from './AsyncCommandManager/useAsyncCommand';
import { ErrorMessage } from './ErrorMessage';
import { CardLoader } from './Loader';
import type { PropsWithChildren } from 'react';

type Props<T> = PropsWithChildren<{
  state: AsyncState<T>;
}>;

const AsyncCard = <T,>(props: Props<T>) => {
  const { state, children } = props;
  if (is(state, 'error')) {
    return <ErrorMessage error={state.error} />;
  }

  if (is(state, 'pending')) {
    return <CardLoader loaderWidthP={30} sticky />;
  }

  return children;
};

export default AsyncCard;
