export interface ISoapService {
  sendRequest(action: string, date?: Date): Promise<unknown>;
}
