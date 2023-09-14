import { PAGE_SIZE_OPTIONS } from '@/constants/table';
import { ChangeEvent, FC } from 'react';

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItemCount: number;
  onPageChange(page: number): void;
  onPageSizeChange(pageSize: number): void;
};

export const Pagination: FC<PaginationProps> = ({
  page,
  pageSize,
  totalItemCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const maxPages = Math.ceil(totalItemCount / pageSize);
  const pageStart = (page - 1) * pageSize + 1;
  const pageEnd =
    page * pageSize < totalItemCount ? page * pageSize : totalItemCount;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (maxPages > page) {
      onPageChange(page + 1);
    }
  };

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value);
    const newMaxPages = Math.ceil(totalItemCount / newPageSize);

    if (page > newMaxPages) {
      onPageChange(newMaxPages);
    }
    onPageSizeChange(newPageSize);
  };

  return (
    <nav
      className="flex items-center justify-between flex-1 pt-4 mt-auto"
      aria-label="Table navigation"
    >
      <span className="hidden text-sm font-normal text-gray-500 md:block">
        Showing{' '}
        <span className="font-semibold text-gray-900 ">
          {pageStart} -{pageEnd}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-gray-900 ">{totalItemCount}</span>
      </span>
      <div className="flex flex-1 md:flex-grow-0 flex-row gap-4 justify-between md:self-end sm:flex-start">
        <select
          className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:hover:cursor-not-allowed"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => {
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            );
          })}
        </select>
        <ul className="inline-flex -space-x-px text-sm h-8 gap-2">
          <li>
            <button
              disabled={page === 1}
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:hover:cursor-not-allowed"
              onClick={handlePrevious}
            >
              Prev
            </button>
          </li>
          <li>
            <p className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:text-blue-700">
              {page}
            </p>
          </li>
          <li>
            <button
              disabled={page === maxPages}
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:hover:cursor-not-allowed"
              onClick={handleNext}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
