import { Int16, Int32, NullableString } from '../../primitives';
import { ResponseHeaderV0 } from '../../responses';
import { ApiVersionsResponseV0Data } from '../../responses/api-versions/api-versions-response-v0';
import { type WriteBuffer } from '../../serialization';
import { RequestHeaderV1, type RequestHeader } from '../headers';
import { type Request } from '../request';

export class ApiVersionsRequestV0 implements Request<ApiVersionsResponseV0Data> {
  public readonly apiKey: number = 18;
  public readonly apiVersion: number = 0;
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = ApiVersionsResponseV0Data;

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
