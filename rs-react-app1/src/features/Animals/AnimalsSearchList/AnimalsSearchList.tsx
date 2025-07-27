import { useCallback, useEffect, useRef } from 'react';

import type {
  ISearchAnimals,
  SearchAnimalsRequestDto,
} from '../fetch/SearchAnimals';
import searchAnimals from '../fetch/SearchAnimals';

import { injectProps } from '~utils/react/injectProps';
import { AnimalsSearchListView } from './AnimalsSearchListView';
import { useSearchParams } from '~hooks';
import { useAsyncCommand } from '~components/AsyncCommandManager/useAsyncCommand';
import type { SearchParams } from '../types';

type Props = {
  command: ISearchAnimals;
};
// let pagesize be fixed for now
const PAGE_SIZE = 25;

export const AnimalsSearchList = (props: Props) => {
  const { command } = props;
  const { request, state } = useAsyncCommand(command);

  const isIdlingRef = useRef(true);
  const didMountPhaseRef = useRef(true);

  const [{ page, query }, setSearchParams] = useSearchParams<SearchParams>();
  const pageNumber = page !== undefined ? Number(page) : 1;

  const handleSearch = useCallback(
    (query: string) => {
      setSearchParams(query !== '' ? { query } : {});
      isIdlingRef.current = false;
    },
    [setSearchParams]
  );

  useEffect(() => {
    const onUnmount = () => {
      didMountPhaseRef.current = true;
    };
    if (
      didMountPhaseRef.current === true &&
      [page, query].every((v) => v === undefined)
    ) {
      didMountPhaseRef.current = false;
      return onUnmount;
    }

    didMountPhaseRef.current = false;

    const searchAnimalsRequestDto: SearchAnimalsRequestDto = {
      pageNumber: pageNumber - 1,
      name: query ?? '',
      pageSize: PAGE_SIZE,
    };

    request(searchAnimalsRequestDto);
    return onUnmount;
    // page is only needed on didMount stage, not on didUpdate stage
  }, [pageNumber, query, request]);

  return (
    <AnimalsSearchListView
      page={pageNumber}
      state={state}
      onSearch={handleSearch}
    />
  );
};

const AnimalsSearchListInjected = injectProps(AnimalsSearchList, {
  command: searchAnimals,
});
export default AnimalsSearchListInjected;
