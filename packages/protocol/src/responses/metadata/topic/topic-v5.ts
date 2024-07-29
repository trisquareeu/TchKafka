import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV5 } from './partition';

export class TopicV5 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV5>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV5> {
    return new TopicV5(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV5.deserialize)
    );
  }
}
