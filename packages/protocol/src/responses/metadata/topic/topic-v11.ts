import { TagSection } from '../../../commons';
import { Boolean, CompactArray, CompactString, Int16, Int32, Uuid } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV11 } from './partition';

export class TopicV11 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: CompactString,
    public readonly topicId: Uuid,
    public readonly isInternal: Boolean,
    public readonly partitions: CompactArray<PartitionV11>,
    public readonly topicAuthorizedOperations: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): TopicV11 {
    return new TopicV11(
      Int16.deserialize(buffer),
      CompactString.deserialize(buffer),
      Uuid.deserialize(buffer),
      Boolean.deserialize(buffer),
      CompactArray.deserialize(buffer, PartitionV11.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
