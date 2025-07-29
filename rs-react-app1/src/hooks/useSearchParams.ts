import {
  useSearchParams as useRouterSearchParams,
  type NavigateOptions,
} from 'react-router';
import { useMemo } from 'react';

type SetSearchParams<T> = (params: T, options?: NavigateOptions) => void;
export const useSearchParams = <T extends Record<string, string>>(): [
  Partial<T>,
  SetSearchParams<Partial<T>>,
] => {
  const [searchParams, setSearchParams] = useRouterSearchParams();

  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  return [params as Partial<T>, setSearchParams as SetSearchParams<Partial<T>>];
};
