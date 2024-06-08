import { TagSection } from '../../commons';
import { type CompactString } from '../../primitives';
import { ApiVersionsResponseV3Data, ResponseHeaderV0 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type Request } from '../request';
import { type RequestHeaderV2 } from '../headers';

export class ApiVersionsRequestV3 implements Request<ApiVersionsResponseV3Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = ApiVersionsResponseV3Data;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly clientSoftwareName: CompactString,
    public readonly clientSoftwareVersion: CompactString,
    public readonly tagSection: TagSection = new TagSection([])
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.clientSoftwareName.serialize(buffer);
    await this.clientSoftwareVersion.serialize(buffer);
    await this.tagSection.serialize(buffer);
  }
}
