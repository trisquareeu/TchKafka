import { TagSection } from '../../commons';
import { CompactArray, CompactNullableString, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV9 } from './broker';
import { TopicV9 } from './topic';

export class MetadataResponseV9Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: CompactArray<BrokerV9>,
    public readonly clusterId: CompactNullableString,
    public readonly controllerId: Int32,
    public readonly topics: CompactArray<TopicV9>,
    public readonly clusterAuthorizedOperations: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): MetadataResponseV9Data {
    return new MetadataResponseV9Data(
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, BrokerV9.deserialize),
      CompactNullableString.deserialize(buffer),
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, TopicV9.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
