import { Array, Int32 } from '../../primitives';
import { type ReadBuffer } from '../../serialization';
import { BrokerV1 } from './broker';
import { TopicV1 } from './topic';

export class MetadataResponseV1Data {
  constructor(
    public readonly brokers: Array<BrokerV1>,
    public readonly controllerId: Int32,
    public readonly topics: Array<TopicV1>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<MetadataResponseV1Data> {
    return new MetadataResponseV1Data(
      await Array.deserialize(buffer, BrokerV1.deserialize),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, TopicV1.deserialize)
    );
  }
}
