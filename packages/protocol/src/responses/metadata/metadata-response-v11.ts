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

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV11Data> {
    return new MetadataResponseV11Data(
      await Int32.deserialize(buffer),
      await CompactArray.deserialize(buffer, BrokerV11.deserialize),
      await CompactNullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await CompactArray.deserialize(buffer, TopicV11.deserialize),
      await TagSection.deserialize(buffer)
    );
  }
}
