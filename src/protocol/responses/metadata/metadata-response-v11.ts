import { TagSection } from '../../commons';
import { CompactArray, CompactNullableString, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV11 } from './broker';
import { TopicV11 } from './topic';

export class MetadataResponseV11Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: CompactArray<BrokerV11>,
    public readonly clusterId: CompactNullableString,
    public readonly controllerId: Int32,
    public readonly topics: CompactArray<TopicV11>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): MetadataResponseV11Data {
    return new MetadataResponseV11Data(
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, BrokerV11.deserialize),
      CompactNullableString.deserialize(buffer),
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, TopicV11.deserialize),
      TagSection.deserialize(buffer)
    );
  }
}
