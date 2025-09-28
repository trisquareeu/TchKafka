import { type UUID } from 'crypto';
import { TagSection } from '../../commons';
import {
  CompactArray,
  CompactNullableString,
  CompactString,
  Int16,
  Int32,
  NullableString,
  Uuid
} from '../../primitives';
import { RequestHeaderV2 } from '../headers';
import { RequestBuilderTemplate } from '../request-builder';
import { ConsumerGroupHeartbeatRequestV1 } from './consumer-group-heartbeat-request-v1';
import { TopicPartitionV1 } from './topic-partition';

export type ConsumerGroupHeartbeatRequest = ConsumerGroupHeartbeatRequestV1;

export class ConsumerGroupHeartbeatRequestBuilder extends RequestBuilderTemplate<ConsumerGroupHeartbeatRequest> {
  private static readonly apiKey = 68;

  constructor(
    private readonly clientId: string,
    private readonly groupId: string,
    private readonly memberId: string,
    private readonly memberEpoch: number,
    private readonly instanceId: string | null,
    private readonly rackId: string | null,
    private readonly rebalanceTimeoutMs: number,
    private readonly subscribedTopicNames: string[] | null,
    private readonly serverAssignor: string | null,
    private readonly topicPartitions: { topicId: UUID; partitions: number[] }[] | null
  ) {
    super(ConsumerGroupHeartbeatRequestBuilder.apiKey, 1, 1);
  }

  public override getApiKey(): number {
    return ConsumerGroupHeartbeatRequestBuilder.apiKey;
  }

  protected override buildRequest(_minVersion: number, _maxVersion: number): ConsumerGroupHeartbeatRequestV1 {
    return new ConsumerGroupHeartbeatRequestV1(
      new RequestHeaderV2(
        new Int16(ConsumerGroupHeartbeatRequestBuilder.apiKey),
        new Int16(1),
        new NullableString(this.clientId),
        new TagSection()
      ),
      new CompactString(this.groupId),
      new CompactString(this.memberId),
      new Int32(this.memberEpoch),
      new CompactNullableString(this.instanceId),
      new CompactNullableString(this.rackId),
      new Int32(this.rebalanceTimeoutMs),
      new CompactArray(
        this.subscribedTopicNames === null ? null : this.subscribedTopicNames.map((name) => new CompactString(name)),
        (topic, buffer) => topic.serialize(buffer)
      ),
      new CompactNullableString(null),
      new CompactNullableString(this.serverAssignor),
      new CompactArray(
        this.topicPartitions === null
          ? null
          : this.topicPartitions.map(
              (tp) =>
                new TopicPartitionV1(
                  Uuid.from(tp.topicId),
                  new CompactArray(
                    tp.partitions.map((partition) => new Int32(partition)),
                    (partition, buffer) => partition.serialize(buffer)
                  ),
                  new TagSection()
                )
            ),
        (topicPartition, buffer) => topicPartition.serialize(buffer)
      ),
      new TagSection()
    );
  }
}
