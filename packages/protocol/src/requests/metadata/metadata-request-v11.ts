import { type TagSection } from '../../commons';
import { type Boolean, type CompactArray } from '../../primitives';
import { MetadataResponseV11Data, ResponseHeaderV1 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV2 } from '../headers';
import { type Request } from '../request';
import { type TopicV10 } from './topic';

export class MetadataRequestV11 implements Request<MetadataResponseV11Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV1;
  public readonly ExpectedResponseDataClass = MetadataResponseV11Data;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly topics: CompactArray<TopicV10>,
    public readonly allowAutoTopicCreation: Boolean,
    public readonly includeTopicAuthorizedOperations: Boolean,
    public readonly tags: TagSection
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.topics.serialize(buffer);
    await this.allowAutoTopicCreation.serialize(buffer);
    await this.includeTopicAuthorizedOperations.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}
