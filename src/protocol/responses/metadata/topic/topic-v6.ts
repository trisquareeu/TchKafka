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

  public static deserialize(buffer: ReadBuffer): TopicV6 {
    return new TopicV6(
      Int16.deserialize(buffer),
      String.deserialize(buffer),
      Boolean.deserialize(buffer),
      Array.deserialize(buffer, PartitionV6.deserialize)
    );
  }
}
