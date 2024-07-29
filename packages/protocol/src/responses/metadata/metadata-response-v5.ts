import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV5 } from './broker';
import { TopicV5 } from './topic';

export class MetadataResponseV5Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: Array<BrokerV5>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV5>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV5Data> {
    return new MetadataResponseV5Data(
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, BrokerV5.deserialize),
      await NullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV5.deserialize)
    );
  }
}
