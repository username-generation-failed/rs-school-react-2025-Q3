import type { ReactNode } from 'react';
import { PaginationEllipsis } from './PaginationEllipsis';
import clsx from 'clsx';

export type Props = {
  activePage: number;
  lastPage: number;
  renderItem: (page: number, activePage: number) => ReactNode;
  className?: string;
};
const generate = (
  count: number,
  activePage: number,
  renderItem: Props['renderItem']
) => [...Array(count).keys()].map((page) => renderItem(page + 1, activePage));
export const Pagination = (props: Props) => {
  const { activePage, renderItem, lastPage, className } = props;

  if (lastPage <= 1) return null;

  const items =
    lastPage < 5
      ? generate(lastPage, activePage, renderItem)
      : [
          ...generate(5, activePage, renderItem),
          <PaginationEllipsis key="pagination_ellipsis" />,
          renderItem(lastPage, activePage),
        ];

  return (
    <div className={clsx('flex justify-center gap-x-1', className)}>
      {items}
    </div>
  );
};
