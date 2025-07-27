import AnimalsSearch from './AnimalsSearch';
import { is } from '~components/AsyncCommandManager/useAsyncCommand';
import { AnimalsList } from './AnimalsList';
import clsx from 'clsx';
import { CardLoader } from '~components/Loader';
import { ErrorMessage } from '~components/ErrorMessage';
import type { AsyncState } from '~lib/types';
import type { PaginatedResponceDto } from '../types';
import { AnimalsListPagination } from './AnimalsListPagination';

export type Props = {
  state: AsyncState<PaginatedResponceDto>;
  page?: number;
  onSearch: (value: string) => void;
};

export const AnimalsSearchListView = (props: Props) => {
  const { state, onSearch, page = 1 } = props;

  return (
    <div className={clsx('flex min-h-full w-lg max-w-lg grow-1 flex-col pb-6')}>
      <div
        className={clsx(
          'z-50',
          is(state, 'idle')
            ? 'absolute top-[50%] w-lg translate-y-[-50%]'
            : 'sticky top-0 my-6'
        )}
      >
        <AnimalsSearch onSearch={onSearch} />
      </div>

      <div className={clsx('relative grow-1')}>
        {is(state, 'pending') && (
          <CardLoader sticky loaderWidthP={30} className="rounded-lg" />
        )}
        {is(state, 'success') && (
          <>
            <AnimalsList
              className="overflow-hidden rounded-lg"
              items={state.result.result}
            />
            <AnimalsListPagination
              activePage={page}
              lastPage={Math.ceil(state.result.count / state.result.pageSize)}
            />
          </>
        )}

        {is(state, 'success') && state.result.result.length === 0 && (
          <div className="absolute flex h-full w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600">
            <p>Nothing Found</p>
          </div>
        )}

        {is(state, 'error') && <ErrorMessage error={state.error} />}
      </div>
    </div>
  );
};
