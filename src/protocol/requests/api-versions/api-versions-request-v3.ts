import { TagSection } from '../../commons';
import { type CompactString, Int16, Int32, NullableString } from '../../primitives';
import { ResponseHeaderV0 } from '../../responses';
import { ApiVersionsResponseV3Data } from '../../responses/api-versions';
import { type WriteBuffer } from '../../serialization';
import { RequestHeaderV2, type RequestHeader } from '../headers';
import { type Request } from '../request';

export class ApiVersionsRequestV3 implements Request<ApiVersionsResponseV3Data> {
  public readonly apiKey: number = 18;
  public readonly apiVersion: number = 3;
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = ApiVersionsResponseV3Data;

  constructor(
    public readonly clientSoftwareName: CompactString,
    public readonly clientSoftwareVersion: CompactString,
    public readonly tagSection: TagSection = new TagSection()
  ) {}

  public buildHeader(correlationId: number, clientId: string | null = null): RequestHeader {
    return new RequestHeaderV2(
      new Int16(this.apiKey),
      new Int16(this.apiVersion),
      new Int32(correlationId),
      new NullableString(clientId),
      new TagSection()
    );
  }

  public serialize(buffer: WriteBuffer): void {
    this.clientSoftwareName.serialize(buffer);
    this.clientSoftwareVersion.serialize(buffer);
    this.tagSection.serialize(buffer);
  }
}
