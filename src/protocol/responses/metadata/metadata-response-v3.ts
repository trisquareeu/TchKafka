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

  public static deserialize(buffer: ReadBuffer): MetadataResponseV3Data {
    return new MetadataResponseV3Data(
      Int32.deserialize(buffer),
      Array.deserialize(buffer, BrokerV3.deserialize),
      NullableString.deserialize(buffer),
      Int32.deserialize(buffer),
      Array.deserialize(buffer, TopicV3.deserialize)
    );
  }
}
