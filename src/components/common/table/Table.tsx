'use client';
import moment from 'moment';
import { Loader } from '../Loader';
import { EmptyList } from './EmptyList';
import { ListError } from './ListError';
import { Pagination } from './Pagination';

type TableColumn<T> = {
  name: string;
  key: keyof T;
  type: 'string' | 'number' | 'date' | 'array';
};

type TableProps<T> = {
  isLoading?: boolean;
  hasError?: boolean;
  page: number;
  pageSize: number;
  totalItemCount: number;
  items: T[];
  columns: TableColumn<T>[];
  onPageChange(page: number): void;
  onPageSizeChange(pageSize: number): void;
};

function getColumnValue<T>(column: TableColumn<T>, item: T) {
  const value = item[column.key];
  switch (column.type) {
    case 'string':
      return String(value);
    case 'number':
      return Number(value);
    case 'date':
      return moment(value as Date).format('DD-MM-YYYY');
    case 'array':
      return (value as unknown[]).join('.');
  }
}

export const Table = <
  T extends Record<string, string | number | Date | unknown[]>,
>({
  page,
  pageSize,
  totalItemCount,
  items,
  columns,
  isLoading = false,
  hasError = false,
  onPageChange,
  onPageSizeChange,
}: TableProps<T>) => {
  return (
    <div className="h-[90%]  flex-1 flex flex-col">
      <div className="overflow-y-auto h-[80%] md:h-[90%]">
        {!isLoading && !hasError && items.length > 0 && (
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
                      const value = getColumnValue(col, item);
                      return (
                        <td key={col.key.toString()} className="px-6 py-4">
                          {value}
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
        )}
        {!isLoading && !hasError && items.length === 0 && <EmptyList />}
        {isLoading && !hasError && <Loader />}
        {!isLoading && hasError && <ListError />}
      </div>
      {!isLoading && !hasError && items.length > 0 && (
        <div className="flex-1">
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItemCount={totalItemCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};
