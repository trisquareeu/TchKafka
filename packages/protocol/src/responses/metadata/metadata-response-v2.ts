import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV2 } from './broker';
import { TopicV2 } from './topic';

export class MetadataResponseV2Data {
  constructor(
    public readonly brokers: Array<BrokerV2>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV2>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV2Data> {
    return new MetadataResponseV2Data(
      await Array.deserialize(buffer, BrokerV2.deserialize),
      await NullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV2.deserialize)
    );
  }
}
