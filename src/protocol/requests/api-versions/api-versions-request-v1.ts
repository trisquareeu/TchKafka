import { Int16, Int32, NullableString } from '../../primitives';
import { ResponseHeaderV0 } from '../../responses';
import { ApiVersionsResponseV1Data } from '../../responses/api-versions';
import { type WriteBuffer } from '../../serialization';
import { RequestHeaderV1, type RequestHeader } from '../headers';
import { type Request } from '../request';

export class ApiVersionsRequestV1 implements Request<ApiVersionsResponseV1Data> {
  public readonly apiKey: number = 18;
  public readonly apiVersion: number = 1;
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = ApiVersionsResponseV1Data;

  public buildHeader(correlationId: number, clientId: string | null = null): RequestHeader {
    return new RequestHeaderV1(
      new Int16(this.apiKey),
      new Int16(this.apiVersion),
      new Int32(correlationId),
      new NullableString(clientId)
    );
  }

  public serialize(_buffer: WriteBuffer): void {}
}
