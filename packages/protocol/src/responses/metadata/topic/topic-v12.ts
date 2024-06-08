import { TagSection } from '../../../commons';
import { Boolean, CompactArray, CompactNullableString, Int16, Int32, Uuid } from '../../../primitives';
import { type ReadBuffer } from '../../../serialization';
import { PartitionV12 } from './partition';

export class TopicV12 {
  constructor(
    public readonly errorCode: Int16,
    public readonly name: CompactNullableString,
    public readonly topicId: Uuid,
    public readonly isInternal: Boolean,
    public readonly partitions: CompactArray<PartitionV12>,
    public readonly topicAuthorizedOperations: Int32,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): TopicV12 {
    return new TopicV12(
      Int16.deserialize(buffer),
      CompactNullableString.deserialize(buffer),
      Uuid.deserialize(buffer),
      Boolean.deserialize(buffer),
      CompactArray.deserialize(buffer, PartitionV12.deserialize),
      Int32.deserialize(buffer),
      TagSection.deserialize(buffer)
    );
  }
}
