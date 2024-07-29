import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV4 } from './partition';

export class TopicV4 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV4>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV4> {
    return new TopicV4(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV4.deserialize)
    );
  }
}
