import { Array, Boolean, Int16, Int32, String } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV8 } from './partition';

export class TopicV8 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: String,
    public readonly isInternal: Boolean,
    public readonly partitions: Array<PartitionV8>,
    public readonly topicAuthorizedOperations: Int32
  ) {}

  public static deserialize(buffer: ReadBuffer): TopicV8 {
    return new TopicV8(
      Int16.deserialize(buffer),
      String.deserialize(buffer),
      Boolean.deserialize(buffer),
      Array.deserialize(buffer, PartitionV8.deserialize),
      Int32.deserialize(buffer)
    );
  }
}
