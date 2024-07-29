import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV3 } from './broker';
import { TopicV3 } from './topic';

export class MetadataResponseV3Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: Array<BrokerV3>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV3>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV3Data> {
    return new MetadataResponseV3Data(
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, BrokerV3.deserialize),
      await NullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV3.deserialize)
    );
  }
}
