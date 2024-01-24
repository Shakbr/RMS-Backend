import { ISoapHelper } from '@/interfaces/helpers/ISoapHelper';
import axios from 'axios';
import { injectable } from 'inversify';

@injectable()
export class SoapHelper implements ISoapHelper {
  // TODO this is a temporary solution, need to find a better way to handle this
  public async sendRequest(action: string, date: Date = null): Promise<string> {
    const url = process.env.WAYBILL_SERVICE_URL;
    const username = process.env.WAYBILL_SERVICE_USERNAME;
    const password = process.env.WAYBILL_SERVICE_PASSWORD;

    const bodyDateArg = date ? `<create_date_s>${new Date(date.setHours(0, 0, 1)).toISOString()}</create_date_s>` : '';

    const body = `<?xml version="1.0" encoding="utf-8"?>
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:xsd="http://www.w3.org/2001/XMLSchema"
      xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
        <soap12:Body>
          <${action} xmlns="http://tempuri.org/">
            <su>${username}</su>
            <sp>${password}</sp>
            ${bodyDateArg}
          </${action}>
        </soap12:Body>
      </soap12:Envelope>`;
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
      },
    });
    return response.data;
  }
}
