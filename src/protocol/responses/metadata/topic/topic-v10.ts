import { TagSection } from '../../../commons';
import { Boolean, CompactArray, CompactString, Int16, Int32, Uuid } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV10 } from './partition';

export class TopicV10 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: CompactString,
    public readonly topicId: Uuid,
    public readonly isInternal: Boolean,
    public readonly partitions: CompactArray<PartitionV10>,
    public readonly topicAuthorizedOperations: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): TopicV10 {
    return new TopicV10(
      Int16.deserialize(buffer),
      CompactString.deserialize(buffer),
      Uuid.deserialize(buffer),
      Boolean.deserialize(buffer),
      CompactArray.deserialize(buffer, PartitionV10.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
