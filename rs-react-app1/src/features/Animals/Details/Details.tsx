import { useEffect } from 'react';
import { useSearchParams } from '~hooks/useSearchParams';
import { injectProps } from '~utils/react/injectProps';
import type { IGetDetailsById } from '../fetch/GetDetailsById';
import getDetailsById from '../fetch/GetDetailsById';
import { useAsyncCommand } from '~components/AsyncCommandManager/useAsyncCommand';
import AsyncCard from '~components/AsyncCard';
import clsx from 'clsx';
import { CloseDetails } from './CloseDetails';
import type { SearchParams } from '~features/Animals/types';

type Props = {
  command: IGetDetailsById;
};

export const Details = (props: Props) => {
  const { command } = props;
  const [{ details, query }] = useSearchParams<SearchParams>();

  const { state, request } = useAsyncCommand(command);

  useEffect(() => {
    if (details === undefined || query === undefined) return;
    request({ id: details });
  }, [details, request, query]);

  if (details === undefined || query === undefined) return null;

  return (
    <div className={clsx('relative w-sm px-5')}>
      <div className="sticky top-0 flex h-screen flex-col justify-center">
        <AsyncCard state={state}>
          <CloseDetails />
          <h4 className="text-lg">{state.result?.name}</h4>
          <p className="text-gray-400">{state.result?.text}</p>
        </AsyncCard>
      </div>
    </div>
  );
};

const DetailsInjected = injectProps(Details, {
  command: getDetailsById,
});

export default DetailsInjected;
