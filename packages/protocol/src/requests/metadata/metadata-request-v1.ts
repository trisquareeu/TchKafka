import { type Array, type String } from '../../primitives';
import { MetadataResponseV1Data, ResponseHeaderV0 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';

export class MetadataRequestV1 implements Request<MetadataResponseV1Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = MetadataResponseV1Data;

  constructor(
    public readonly header: RequestHeaderV1,
    public readonly topics: Array<String>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.topics.serialize(buffer);
  }
}
