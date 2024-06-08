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

  public static deserialize(buffer: ReadBuffer): TopicV2 {
    return new TopicV2(
      Int16.deserialize(buffer),
      String.deserialize(buffer),
      Boolean.deserialize(buffer),
      Array.deserialize(buffer, PartitionV2.deserialize)
    );
  }
}
