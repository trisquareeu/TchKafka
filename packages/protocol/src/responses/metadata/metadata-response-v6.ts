import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV6 } from './broker';
import { TopicV6 } from './topic';

export class MetadataResponseV6Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: Array<BrokerV6>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV6>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV6Data> {
    return new MetadataResponseV6Data(
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, BrokerV6.deserialize),
      await NullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV6.deserialize)
    );
  }
}
