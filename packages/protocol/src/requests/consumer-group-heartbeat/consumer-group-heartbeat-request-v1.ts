import { type TagSection } from '../../commons';
import { type CompactArray, type CompactNullableString, type CompactString, type Int32 } from '../../primitives';
import { ConsumerGroupHeartbeatResponseV1Data, ResponseHeaderV1 } from '../../responses';
import { type WriteBuffer } from '../../serialization';
import { type RequestHeaderV2 } from '../headers';
import { type Request } from '../request';
import { type TopicPartitionV1 } from './topic-partition';

export class ConsumerGroupHeartbeatRequestV1 implements Request<ConsumerGroupHeartbeatResponseV1Data> {
  public readonly ExpectedResponseHeaderClass = ResponseHeaderV1;
  public readonly ExpectedResponseDataClass = ConsumerGroupHeartbeatResponseV1Data;

  constructor(
    public readonly header: RequestHeaderV2,
    public readonly groupId: CompactString,
    public readonly memberId: CompactString,
    public readonly memberEpoch: Int32,
    public readonly instanceId: CompactNullableString,
    public readonly rackId: CompactNullableString,
    public readonly rebalanceTimeoutMs: Int32,
    public readonly subscribedTopicNames: CompactArray<CompactString>,
    public readonly subscribedTopicRegex: CompactNullableString,
    public readonly serverAssignor: CompactNullableString,
    public readonly topicPartitions: CompactArray<TopicPartitionV1>,
    public readonly tags: TagSection
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.header.serialize(buffer);
    await this.groupId.serialize(buffer);
    await this.memberId.serialize(buffer);
    await this.memberEpoch.serialize(buffer);
    await this.instanceId.serialize(buffer);
    await this.rackId.serialize(buffer);
    await this.rebalanceTimeoutMs.serialize(buffer);
    await this.subscribedTopicNames.serialize(buffer);
    await this.subscribedTopicRegex.serialize(buffer);
    await this.serverAssignor.serialize(buffer);
    await this.topicPartitions.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}
