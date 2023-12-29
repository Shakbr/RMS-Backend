import { asyncHandler } from '@/helpers/asyncHandler';
import { Waybill } from '@/models/Waybill';
import { WaybillService } from '@/services/WaybillService';
import { AuthRequest } from '@/types/types';
import { NextFunction, Response } from 'express';

export class WaybillController {
  private waybillService: WaybillService;

  constructor() {
    this.waybillService = new WaybillService();
  }

  syncDailyWaybills = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    await this.waybillService.syncDailyWaybills(req.user.id);
  });

  syncWaybillUnits = asyncHandler(async (_req: AuthRequest, _res: Response, _next: NextFunction) => {
    await this.waybillService.syncWaybillUnits();
  });

  findAll = asyncHandler(async (req: AuthRequest, _res: Response, _next: NextFunction) => {
    const query = {};
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const offset = (page - 1) * limit;

    const { count, rows: waybills } = await Waybill.findAndCountAll({ where: query, limit, offset });

    const totalPage = Math.ceil(count / limit);

    return { waybills, totalItems: count, totalPage, currentPage: page };
  });
}
