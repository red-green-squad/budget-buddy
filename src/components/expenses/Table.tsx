'use client';
import { ChangeEvent } from 'react';

type TableProps<T> = {
  page: number;
  pageSize: number;
  totalItemCount: number;
  items: T[];
  columns: {
    key: keyof T;
    name: string;
    type: 'string' | 'number' | 'date';
  }[];
  onPageChange(page: number): void;
  onPageSizeChange(pageSize: number): void;
};

export const Table = <
  T extends Record<string, string | number | Date | boolean | unknown[]>,
>({
  page,
  pageSize,
  totalItemCount,
  items,
  columns,
  onPageChange,
  onPageSizeChange,
}: TableProps<T>) => {
  const maxPages = Math.ceil(totalItemCount / pageSize);
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
    <div className="h-[90%]  flex-1 flex flex-col">
      <div className="overflow-y-auto h-[80%] md:h-[90%]">
        <table className="w-full overflow-x-auto text-sm text-left text-gray-500 h-90">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 md:sticky md:top-0 w-full ">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              {columns.map((col) => {
                return (
                  <th
                    key={col.key.toString()}
                    scope="col"
                    className={'px-6 py-3'}
                  >
                    {col.name}
                  </th>
                );
              })}
              <th scope="col" className="p-4">
                <div className="flex items-center"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (
                <tr
                  key={item['id'].toString()}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500   focus:ring-2 "
                      />
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  {columns.map((col) => {
                    //TODO: Add a method that will extract the value from the columns
                    const value = item[col.key];
                    const formattedValue = ['string', 'number'].includes(
                      typeof value
                    )
                      ? value
                      : value.toString();
                    return (
                      <td key={col.key.toString()} className="px-6 py-4">
                        {formattedValue as string}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600  hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <nav
        className="flex items-center justify-between flex-1 pt-4 mt-auto"
        aria-label="Table navigation"
      >
        <span className="hidden text-sm font-normal text-gray-500 md:block">
          Showing{' '}
          <span className="font-semibold text-gray-900 ">
            {(page - 1) * pageSize + 1}-
            {page * pageSize < totalItemCount
              ? page * pageSize
              : totalItemCount}
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
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
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
    </div>
  );
};
