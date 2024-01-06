export interface IWaybillResponse {
  WAYBILL_NUMBER: string;
  TIN: number;
  BARCODE: string;
  NAME: string;
  W_NAME: string;
  UNIT_ID: number;
  PRICE: number;
  QUANTITY: number;
  AMOUNT: number;
  BAR_CODE: string;
  STATUS: number;
}

export interface IWaybillUnitResponse {
  unitId: number;
  name: string;
}

export interface IWaybillHelper {
  getWaybills(date: Date): Promise<IWaybillResponse[]>;
  getWaybillUnits(): Promise<IWaybillUnitResponse[]>;
}
