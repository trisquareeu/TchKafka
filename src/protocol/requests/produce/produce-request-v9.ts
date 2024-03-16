import { TagSection } from '../../commons';
import { type CompactArray, type CompactNullableString, type Int16, type Int32 } from '../../primitives';
import { ProduceResponseV9Data, ResponseHeaderV1 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV2 } from '../headers';
import { type Request } from '../request';
import { type TopicDataV9 } from './topic-data';

export class ProduceRequestV9 implements Request<ProduceResponseV9Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV1;
  public readonly ExpectedResponseDataClass = ProduceResponseV9Data;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly transactionalId: CompactNullableString,
    public readonly acks: Int16,
    public readonly timeout: Int32,
    public readonly topicData: CompactArray<TopicDataV9>,
    public readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.transactionalId.serialize(buffer);
    await this.acks.serialize(buffer);
    await this.timeout.serialize(buffer);
    await this.topicData.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}
