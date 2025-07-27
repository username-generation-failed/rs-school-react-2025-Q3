import type { PropsWithChildren } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router';

type Props = PropsWithChildren<{
  pathname?: string;
  hash?: string;
  query?: Record<string, string | undefined>;
  className?: string;
}>;

export const Link = (props: Props) => {
  const { pathname, hash, query = {}, children, className } = props;

  const [searchParams] = useSearchParams();
  Object.keys(query).forEach((k) => {
    const value = query[k];
    if (value === undefined) {
      searchParams.delete(k);
      return;
    }
    searchParams.set(k, value);
  });

  return (
    <RouterLink
      className={className}
      to={{ pathname, hash, search: searchParams.toString() }}
    >
      {children}
    </RouterLink>
  );
};
