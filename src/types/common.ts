import { Cake, CakeWithProductsAndNetPrice } from '@/models/Cake';
import { Company } from '@/models/Company';
import { Product } from '@/models/Product';
import { Waybill } from '@/models/Waybill';

export type TAvailableModels = Company | Product | Waybill | Cake;

export type TCustomModelAttributes = CakeWithProductsAndNetPrice;
