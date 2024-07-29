import { Array, Boolean, Int16, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV2 } from './partition';

export class TopicV2 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV2>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV2> {
    return new TopicV2(
      await Int16.deserialize(buffer),
      await String.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await Array.deserialize(buffer, PartitionV2.deserialize)
    );
  }
}
