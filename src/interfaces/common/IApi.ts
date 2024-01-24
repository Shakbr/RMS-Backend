import { TAvailableModels, TCustomModelAttributes } from '@/types/common';

export interface IItemPagination<M extends TAvailableModels | TCustomModelAttributes> {
  items: M[];
  totalItems: number;
  totalPage: number;
  currentPage: number;
}

export interface IItemFilterOptions {
  key: string;
  value: string;
}
