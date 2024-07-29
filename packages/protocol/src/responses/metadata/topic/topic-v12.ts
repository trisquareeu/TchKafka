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

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV12> {
    return new TopicV12(
      await Int16.deserialize(buffer),
      await CompactNullableString.deserialize(buffer),
      await Uuid.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await CompactArray.deserialize(buffer, PartitionV12.deserialize),
      await Int32.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
