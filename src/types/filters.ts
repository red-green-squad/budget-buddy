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

export type Filter = TextFilter | NumericFilter;
