import { inject, injectable } from 'inversify';
import { SERVICE_TYPES } from '@/types/services';
import { ISoapService } from '@/interfaces/services/ISoapService';
import { IWaybillHelper, IWaybillResponse, IWaybillUnitResponse } from '@/interfaces/helpers/IWaybillHelper';

@injectable()
export class WaybillHelper implements IWaybillHelper {
  constructor(@inject(SERVICE_TYPES.SoapService) private soapService: ISoapService) {}

  getWaybills = async (date: Date): Promise<IWaybillResponse[]> => {
    const fromDate = new Date(date);

    const responseObj = await this.soapService.sendRequest('get_buyer_waybilll_goods_list', fromDate);
    return responseObj['soap:Envelope']['soap:Body']['get_buyer_waybilll_goods_listResponse'][
      'get_buyer_waybilll_goods_listResult'
    ]['WAYBILL_LIST']['WAYBILL'];
  };

  getWaybillUnits = async (): Promise<IWaybillUnitResponse[]> => {
    const responseObj = await this.soapService.sendRequest('get_waybill_units');
    const unitData =
      responseObj['soap:Envelope']['soap:Body']['get_waybill_unitsResponse']['get_waybill_unitsResult'][
        'WAYBILL_UNITS'
      ]['WAYBILL_UNIT'];
    return unitData.map((unit: { ID: number; NAME: string }) => ({
      unitId: unit['ID'],
      name: unit['NAME'],
    }));
  };
}
