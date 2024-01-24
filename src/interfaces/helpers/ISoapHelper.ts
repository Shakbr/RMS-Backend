export interface ISoapHelper {
  sendRequest(action: string, date: Date): Promise<string>;
}
