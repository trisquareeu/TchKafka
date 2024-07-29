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

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV8Data> {
    return new MetadataResponseV8Data(
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, BrokerV8.deserialize),
      await NullableString.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV8.deserialize),
      await Int32.deserialize(buffer)
    );
  }
}
