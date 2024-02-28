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

  public static deserialize(buffer: ReadBuffer): TopicV4 {
    return new TopicV4(
      Int16.deserialize(buffer),
      String.deserialize(buffer),
      Boolean.deserialize(buffer),
      Array.deserialize(buffer, PartitionV4.deserialize)
    );
  }
}
