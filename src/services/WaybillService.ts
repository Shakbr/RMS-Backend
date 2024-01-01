import { sendSoapRequest } from '@/helpers/waybillHelper';
import { Company } from '@/models/Company';
import { Product } from '@/models/Product';
import { Waybill } from '@/models/Waybill';
import { WaybillUnit } from '@/models/WaybillUnit';

export class WaybillService {
  async getWaybills() {
    const date = new Date('2023-09-26');

    const responseObj = await sendSoapRequest('get_buyer_waybilll_goods_list', date);
    return responseObj['soap:Envelope']['soap:Body']['get_buyer_waybilll_goods_listResponse'][
      'get_buyer_waybilll_goods_listResult'
    ]['WAYBILL_LIST']['WAYBILL'];
  }

  async getWaybillUnits() {
    const responseObj = await sendSoapRequest('get_waybill_units');
    const unitData =
      responseObj['soap:Envelope']['soap:Body']['get_waybill_unitsResponse']['get_waybill_unitsResult'][
        'WAYBILL_UNITS'
      ]['WAYBILL_UNIT'];
    return unitData.map((unit: { ID: number; NAME: string }) => ({
      unitId: unit['ID'],
      name: unit['NAME'],
    }));
  }

  async syncDailyWaybills(userId: number) {
    const waybillsData = await this.getWaybills();
    if (!waybillsData) return;
    // sync waybill units
    await this.syncWaybillUnits();

    for (const waybillData of waybillsData) {
      console.log(waybillData);
      // create a company if it doesn't exist
      await Company.findOrCreate({
        where: { tin: waybillData.TIN },
        defaults: { name: waybillData.NAME, tin: waybillData.TIN, userId },
      });

      // create a product if it doesn't exist
      const [product, created] = await Product.findOrCreate({
        where: { barcode: String(waybillData.BAR_CODE) },
        defaults: {
          barcode: waybillData.BAR_CODE,
          name: waybillData.W_NAME,
          unitId: waybillData.UNIT_ID,
          price: waybillData.PRICE,
        },
      });
      // if the product was not created and the price is different, add a notification
      if (!created && product.price !== waybillData.PRICE) {
        // for now just log the notification
        console.log(`Price for product ${product.barcode} has changed from ${product.price} to ${waybillData.PRICE}`);
      }

      // create a waybill if it doesn't exist
      await Waybill.findOrCreate({
        where: { waybillId: String(waybillData.WAYBILL_NUMBER), barcode: String(waybillData.BAR_CODE) },
        defaults: {
          waybillId: String(waybillData.WAYBILL_NUMBER),
          tinId: waybillData.TIN,
          unitId: waybillData.UNIT_ID,
          quantity: waybillData.QUANTITY,
          price: waybillData.PRICE,
          amount: waybillData.AMOUNT,
          barcode: String(waybillData.BAR_CODE),
          status: waybillData.STATUS,
        },
      });
    }
  }

  async syncWaybillUnits() {
    const unitData = await this.getWaybillUnits();
    const result = [];
    for (const unit of unitData) {
      result.push(
        await WaybillUnit.findOrCreate({
          where: { unitId: unit.unitId },
          defaults: unit,
        }),
      );
    }
  }
}
