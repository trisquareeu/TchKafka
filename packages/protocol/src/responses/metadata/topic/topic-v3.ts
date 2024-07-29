import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV3 } from './partition';

export class TopicV3 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV3>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV3> {
    return new TopicV3(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV3.deserialize)
    );
  }
}
