import { ISoapHelper } from '@/interfaces/helpers/ISoapHelper';
import { ISoapService } from '@/interfaces/services/ISoapService';
import { HELPER_TYPES } from '@/types/helpers';
import { XmlUtils } from '@/utils/XmlUtils';
import { inject, injectable } from 'inversify';

@injectable()
export class SoapService implements ISoapService {
  constructor(@inject(HELPER_TYPES.SoapHelper) private soapHelper: ISoapHelper) {}
  sendRequest = async (action: string, date: Date = null): Promise<unknown> => {
    const xml = await this.soapHelper.sendRequest(action, date);
    return XmlUtils.parse(xml);
  };
}
