import { EXPENSE_RANGE } from '@/components/common/table/TableToolbar';
import {
  DateFilter,
  DateRangeFilter,
  Filter,
  NumericFilter,
  TextFilter,
} from '@/types/filters';
import moment from 'moment';
import { PipelineStage } from 'mongoose';

function getNumericStage(filter: NumericFilter) {
  const pathString = filter.path.join('.');
  switch (filter.condition) {
    case 'numeric:eq':
      return { $match: { [pathString]: filter.value } };
    case 'numeric:gt':
      return { $match: { [pathString]: { $gt: filter.value } } };
    case 'numeric:lt':
      return { $match: { [pathString]: { $lt: filter.value } } };
  }
}

function getDateFilterState(filter: DateFilter) {
  const pathString = filter.path.join('.');
  switch (filter.condition) {
    case 'date:eq':
      return {
        $match: {
          $and: [
            {
              [pathString]: {
                $gt: moment(filter.value).startOf('day').toDate(),
              },
            },
            {
              [pathString]: { $lt: moment(filter.value).endOf('day').toDate() },
            },
          ],
        },
      };
    case 'date:gt':
      return { $match: { [pathString]: { $gt: new Date(filter.value) } } };
    case 'date:lt':
      return { $match: { [pathString]: { $lt: new Date(filter.value) } } };
  }
}

function getDateRangeStage(filter: DateRangeFilter) {
  const pathString = filter.path.join('.');
  return {
    $match: {
      $and: [
        { [pathString]: { $gt: new Date(filter.value.start) } },
        { [pathString]: { $lt: new Date(filter.value.end) } },
      ],
    },
  };
}

function getTextStage(filter: TextFilter) {
  const pathString = filter.path.join('.');
  switch (filter.condition) {
    case 'text:eq':
      return { $match: { [pathString]: filter.value } };
    case 'text:contains':
      return {
        $match: {
          [pathString]: {
            $regex: filter.value,
            $options: 'i',
          },
        },
      };
  }
}

export function translateFilters(filters: Filter[]): PipelineStage[] {
  const filterPipelines: PipelineStage[] = [];
  for (const filter of filters) {
    switch (filter.type) {
      case 'text': {
        const stage = getTextStage(filter);
        filterPipelines.push(stage);
        break;
      }
      case 'numeric': {
        const stage = getNumericStage(filter);
        filterPipelines.push(stage);
        break;
      }
      case 'date': {
        const stage = getDateFilterState(filter);
        filterPipelines.push(stage);
        break;
      }
      case 'date-range': {
        const stage = getDateRangeStage(filter);
        filterPipelines.push(stage);
        break;
      }
    }
  }
  return filterPipelines;
}

export function getFilter(
  range: Exclude<EXPENSE_RANGE, 'empty'>
): DateFilter | DateRangeFilter {
  const today = moment().toDate();
  switch (range) {
    case 'today':
      return {
        type: 'date',
        path: ['date'],
        condition: 'date:eq',
        value: today,
      };
    case 'thisWeek': {
      const thisWeek = moment().startOf('week');
      return {
        type: 'date-range',
        path: ['date'],
        value: {
          start: thisWeek.toDate(),
          end: today,
        },
      };
    }
    case 'thisMonth': {
      const thisMonth = moment().startOf('month');
      return {
        type: 'date-range',
        path: ['date'],
        value: {
          start: thisMonth.toDate(),
          end: today,
        },
      };
    }
    case 'thisYear': {
      const thisYear = moment().startOf('year');
      return {
        type: 'date-range',
        path: ['date'],
        value: {
          start: thisYear.toDate(),
          end: today,
        },
      };
    }
  }
}
