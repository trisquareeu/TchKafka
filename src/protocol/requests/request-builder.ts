import { type Request } from './request';

export interface RequestBuilder<T extends Request<any>> {
  getApiKey(): number;

  build(correlationId: number, minVersion: number, maxVersion: number): T;
}
