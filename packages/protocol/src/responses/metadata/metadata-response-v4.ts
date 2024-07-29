import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV4 } from './broker';
import { TopicV4 } from './topic';

export class MetadataResponseV4Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: Array<BrokerV4>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV4>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV4Data> {
    return new MetadataResponseV4Data(
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, BrokerV4.deserialize),
      await NullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV4.deserialize)
    );
  }
}
