import { type Boolean, type Array, type String } from '../../primitives';
import { MetadataResponseV4Data, ResponseHeaderV0 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV1 } from '../headers';
import { type Request } from '../request';

export class MetadataRequestV4 implements Request<MetadataResponseV4Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV0;
  public readonly ExpectedResponseDataClass = MetadataResponseV4Data;

  constructor(
    public readonly header: RequestHeaderV1,
    public readonly topics: Array<String>,
    public readonly allowAutoTopicCreation: Boolean
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.topics.serialize(buffer);
    await this.allowAutoTopicCreation.serialize(buffer);
  }
}
