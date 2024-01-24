import { IItemPagination } from '@/interfaces/common/IApi';
import { IAuthRequest } from '@/interfaces/common/IAuth';
import { IWaybillHelper, IWaybillResponse, IWaybillUnitResponse } from '@/interfaces/helpers/IWaybillHelper';
import { ICompanyService } from '@/interfaces/services/ICompanyService';
import { IProductService } from '@/interfaces/services/IProductService';
import { IWaybillService } from '@/interfaces/services/IWaybillService';
import { Product } from '@/models/Product';
import { Waybill } from '@/models/Waybill';
import { WaybillUnit } from '@/models/WaybillUnit';
import { HELPER_TYPES } from '@/types/helpers';
import { SERVICE_TYPES } from '@/types/services';
import { DataUtils } from '@/utils/DataUtils';
import { inject, injectable } from 'inversify';

@injectable()
export class WaybillService implements IWaybillService {
  constructor(
    @inject(SERVICE_TYPES.CompanyService) private companyService: ICompanyService,
    @inject(SERVICE_TYPES.ProductService) private productService: IProductService,
    @inject(HELPER_TYPES.WaybillHelper) private waybillHelper: IWaybillHelper,
  ) {}

  // TODO here I might add a create date to the waybill
  private create = async (data: IWaybillResponse): Promise<void> => {
    // TODO this uniqueBarcode implementation should be refactored
    const uniqueBarcode = DataUtils.generateUniqueBarcode(data.BAR_CODE, data.TIN);
    await Waybill.findOrCreate({
      where: { waybillId: String(data.WAYBILL_NUMBER), barcode: uniqueBarcode },
      defaults: {
        waybillId: String(data.WAYBILL_NUMBER),
        tin: data.TIN,
        unitId: data.UNIT_ID,
        quantity: data.QUANTITY,
        price: data.PRICE,
        amount: data.AMOUNT,
        barcode: uniqueBarcode,
        status: data.STATUS,
        beginDate: data.BEGIN_DATE,
        closeDate: data.CLOSE_DATE,
      },
    });
  };

  findAll = async (req: IAuthRequest): Promise<IItemPagination<Waybill>> => {
    const query = {};
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;

    const offset = (page - 1) * limit;

    const { count, rows: waybills } = await Waybill.findAndCountAll({
      where: query,
      limit,
      offset,
      include: [
        { model: Product, as: 'product', attributes: ['name'] },
        { model: WaybillUnit, as: 'unit', attributes: ['name'] },
      ],
    });

    const totalPage = Math.ceil(count / limit);

    return { items: waybills, totalItems: count, totalPage, currentPage: page };
  };

  syncDailyWaybills = async (req: IAuthRequest): Promise<void> => {
    const date = req.body.date ? req.body.date : new Date('2023-10-01');
    const waybillsData = await this.waybillHelper.getWaybills(date);
    if (!waybillsData) return;
    // sync waybill units
    await this.syncWaybillUnits();
    for (const waybillData of waybillsData) {
      // create a company if it doesn't exist
      await this.companyService.create(req, { name: waybillData.NAME, tin: waybillData.TIN });

      // create a product if it doesn't exist
      const product = await this.productService.create(req, {
        barcode: waybillData.BAR_CODE,
        name: waybillData.W_NAME,
        unitId: waybillData.UNIT_ID,
        price: waybillData.PRICE,
        tin: waybillData.TIN,
      });
      if (product.price !== waybillData.PRICE) {
        // Considering potential floating point precision issues
        const isPriceDifferent = Math.abs(product.price - waybillData.PRICE) > Number.EPSILON;
        if (isPriceDifferent) {
          //TODO here I should add a notification
          console.log(`Price for product ${product.barcode} has changed from ${product.price} to ${waybillData.PRICE}`);
        }
      }

      // create a waybill if it doesn't exist
      await this.create(waybillData);
    }
  };

  syncWaybillUnits = async (): Promise<IWaybillUnitResponse[]> => {
    const unitData = await this.waybillHelper.getWaybillUnits();
    const result = [];
    for (const unit of unitData) {
      result.push(
        await WaybillUnit.findOrCreate({
          where: { unitId: unit.unitId },
          defaults: unit,
        }),
      );
    }
    return result;
  };
}
