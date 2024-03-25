import { TagSection } from '../../commons';
import { CompactArray, CompactNullableString, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV12 } from './broker';
import { TopicV12 } from './topic';

export class MetadataResponseV12Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: CompactArray<BrokerV12>,
    public readonly clusterId: CompactNullableString,
    public readonly controllerId: Int32,
    public readonly topics: CompactArray<TopicV12>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): MetadataResponseV12Data {
    return new MetadataResponseV12Data(
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, BrokerV12.deserialize),
      CompactNullableString.deserialize(buffer),
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, TopicV12.deserialize),
      TagSection.deserialize(buffer)
    );
  }
}
