export type TextFilter = {
  type: 'text';
  path: string[];
  condition: 'text:contains' | 'text:eq';
  value: string;
};

export type NumericFilter = {
  type: 'numeric';
  path: string[];
  condition: 'numeric:eq' | 'numeric:gt' | 'numeric:lt';
  value: number;
};

export type DateFilter = {
  type: 'date';
  path: string[];
  condition: 'date:eq' | 'date:gt' | 'date:lt';
  value: Date;
};

export type DateRangeFilter = {
  type: 'date-range';
  path: string[];
  value: { start: Date; end: Date };
};

export type Filter = TextFilter | NumericFilter | DateFilter | DateRangeFilter;
