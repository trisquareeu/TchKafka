import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV7 } from './partition';

export class TopicV7 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV7>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV7> {
    return new TopicV7(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV7.deserialize)
    );
  }
}
