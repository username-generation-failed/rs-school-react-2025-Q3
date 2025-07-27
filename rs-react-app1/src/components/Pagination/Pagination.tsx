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
  offset: number,
  activePage: number,
  renderItem: Props['renderItem']
) =>
  [...Array(count).keys()].map((page) =>
    renderItem(page + 1 + offset, activePage)
  );
export const Pagination = (props: Props) => {
  const { activePage, renderItem, lastPage, className } = props;

  if (lastPage <= 1) return null;

  let items: ReactNode[];

  if (lastPage < 5) {
    items = generate(lastPage, 0, activePage, renderItem);
  } else if (activePage < 4) {
    items = [
      ...generate(5, 0, activePage, renderItem),
      <PaginationEllipsis key="pagination_ellipsis" />,
      renderItem(lastPage, activePage),
    ];
  } else if (lastPage - activePage > 2) {
    items = [
      renderItem(1, activePage),
      <PaginationEllipsis key="pagination_ellipsis" />,
      ...generate(3, activePage - 2, activePage, renderItem),
      <PaginationEllipsis key="pagination_ellipsis" />,
      renderItem(lastPage, activePage),
    ];
  } else {
    items = [
      renderItem(1, activePage),
      <PaginationEllipsis key="pagination_ellipsis" />,
      generate(5, lastPage - 5, activePage, renderItem),
    ];
  }

  return (
    <div className={clsx('flex justify-center gap-x-1', className)}>
      {items}
    </div>
  );
};
