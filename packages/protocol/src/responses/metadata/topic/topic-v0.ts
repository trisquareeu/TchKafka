import { Array, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV0 } from './partition';

export class TopicV0 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly partitions: Array<PartitionV0>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV0> {
    return new TopicV0(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV0.deserialize)
    );
  }
}
