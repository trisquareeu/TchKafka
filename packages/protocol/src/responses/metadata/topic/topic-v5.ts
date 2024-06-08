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

  public static deserialize(buffer: ReadBuffer): TopicV5 {
    return new TopicV5(
      Int16.deserialize(buffer),
      String.deserialize(buffer),
      Boolean.deserialize(buffer),
      Array.deserialize(buffer, PartitionV5.deserialize)
    );
  }
}
