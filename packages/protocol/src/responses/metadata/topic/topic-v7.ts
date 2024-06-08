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

  public static deserialize(buffer: ReadBuffer): TopicV7 {
    return new TopicV7(
      Int16.deserialize(buffer),
      String.deserialize(buffer),
      Boolean.deserialize(buffer),
      Array.deserialize(buffer, PartitionV7.deserialize)
    );
  }
}
