import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV7 } from './broker';
import { TopicV7 } from './topic';

export class MetadataResponseV7Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: Array<BrokerV7>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV7>
  ) {}

  public static deserialize(buffer: ReadBuffer): MetadataResponseV7Data {
    return new MetadataResponseV7Data(
      Int32.deserialize(buffer),
      Array.deserialize(buffer, BrokerV7.deserialize),
      NullableString.deserialize(buffer),
      Int32.deserialize(buffer),
      Array.deserialize(buffer, TopicV7.deserialize)
    );
  }
}
