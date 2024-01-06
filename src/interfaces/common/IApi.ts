import { TAvailableModels } from '@/types/common';

export interface IItemPagination<M extends TAvailableModels> {
  items: M[];
  totalItems: number;
  totalPage: number;
  currentPage: number;
}

export interface IItemFilterOptions {
  key: string;
  value: string;
}
