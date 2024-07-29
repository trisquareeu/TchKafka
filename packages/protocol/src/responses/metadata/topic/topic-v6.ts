import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV6 } from './partition';

export class TopicV6 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV6>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV6> {
    return new TopicV6(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV6.deserialize)
    );
  }
}
