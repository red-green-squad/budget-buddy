import { Filter, NumericFilter, TextFilter } from '@/types/filters';
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
    }
  }
  return filterPipelines;
}
