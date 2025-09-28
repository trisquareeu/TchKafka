import { Array, Int32, NullableString } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV8 } from './broker';
import { TopicV8 } from './topic';

export class MetadataResponseV8Data {
  constructor(
    public readonly throttleTimeMs: Int32,
    public readonly brokers: Array<BrokerV8>,
    public readonly clusterId: NullableString,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV8>,
    public readonly clusterAuthorizedOperations: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): MetadataResponseV8Data {
    return new MetadataResponseV8Data(
      Int32.deserialize(buffer),
      Array.deserialize(buffer, BrokerV8.deserialize),
      NullableString.deserialize(buffer),
      Int32.deserialize(buffer),
      Array.deserialize(buffer, TopicV8.deserialize),
      Int32.deserialize(buffer)
    );
  }
}
