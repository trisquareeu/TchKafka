import { TagSection } from '../../../commons';
import { Boolean, CompactArray, CompactString, Int16, Int32 } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV9 } from './partition';

export class TopicV9 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: CompactString,
    public readonly isInternal: Boolean,
    public readonly partitions: CompactArray<PartitionV9>,
    public readonly topicAuthorizedOperations: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): TopicV9 {
    return new TopicV9(
      Int16.deserialize(buffer),
      CompactString.deserialize(buffer),
      Boolean.deserialize(buffer),
      CompactArray.deserialize(buffer, PartitionV9.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
