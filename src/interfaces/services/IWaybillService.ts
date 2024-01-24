import { Waybill } from '@/models/Waybill';
import { IItemPagination } from '../common/IApi';
import { IAuthRequest } from '../common/IAuth';
import { IWaybillUnitResponse } from '../helpers/IWaybillHelper';

export interface IWaybillService {
  syncDailyWaybills(req: IAuthRequest): Promise<void>;
  syncWaybillUnits(): Promise<IWaybillUnitResponse[]>;
  findAll(req: IAuthRequest): Promise<IItemPagination<Waybill>>;
}
