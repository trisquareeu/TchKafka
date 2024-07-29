import { TagSection } from '../../commons';
import { CompactArray, CompactNullableString, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV10 } from './broker';
import { TopicV10 } from './topic';

export class MetadataResponseV10Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: CompactArray<BrokerV10>,
    public readonly clusterId: CompactNullableString,
    public readonly controllerId: Int32,
    public readonly topics: CompactArray<TopicV10>,
    public readonly clusterAuthorizedOperations: Int32,
    public readonly tags: TagSection
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV10Data> {
    return new MetadataResponseV10Data(
      await Int32.deserialize(buffer),
      await CompactArray.deserialize(buffer, BrokerV10.deserialize),
      await CompactNullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await CompactArray.deserialize(buffer, TopicV10.deserialize),
      await Int32.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
