import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV1 } from './partition';

export class TopicV1 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV1>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV1> {
    return new TopicV1(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV1.deserialize)
    );
  }
}
