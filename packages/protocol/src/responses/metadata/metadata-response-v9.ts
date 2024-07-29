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

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV9Data> {
    return new MetadataResponseV9Data(
      await Int32.deserialize(buffer),
      await CompactArray.deserialize(buffer, BrokerV9.deserialize),
      await CompactNullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await CompactArray.deserialize(buffer, TopicV9.deserialize),
      await Int32.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
