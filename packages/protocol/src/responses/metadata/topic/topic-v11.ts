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

  public static async deserialize(buffer: ReadBuffer): Promise<TopicV11> {
    return new TopicV11(
      await Int16.deserialize(buffer),
      await CompactString.deserialize(buffer),
      await Uuid.deserialize(buffer),
      await Boolean.deserialize(buffer),
      await CompactArray.deserialize(buffer, PartitionV11.deserialize),
      await Int32.deserialize(buffer),
      await TagSection.deserialize(buffer)
    );
  }
}
