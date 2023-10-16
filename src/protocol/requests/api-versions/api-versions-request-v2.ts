import { Int16, Int32, NullableString } from '../../primitives';
import { ResponseHeaderV0 } from '../../responses';
import { ApiVersionsResponseV2Data } from '../../responses/api-versions';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeader, RequestHeaderV1 } from '../headers';
import { type Request } from '../request';

export class ApiVersionsRequestV2 implements Request<ApiVersionsResponseV2Data> {
  public readonly apiKey: number = 18;
  public readonly apiVersion: number = 2;
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = ApiVersionsResponseV2Data;

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
