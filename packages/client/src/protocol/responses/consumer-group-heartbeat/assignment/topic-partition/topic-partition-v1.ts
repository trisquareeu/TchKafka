import { TagSection } from '../../../../commons';
import { CompactArray, Int32, Uuid } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class TopicPartitionV1 {
  constructor(
    public readonly topicId: Uuid,
    public readonly partitions: CompactArray<Int32>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): TopicPartitionV1 {
    const topicId = Uuid.deserialize(buffer);
    const partitions = CompactArray.deserialize(buffer, Int32.deserialize);
    const tags = TagSection.deserialize(buffer);

    return new TopicPartitionV1(topicId, partitions, tags);
  }
}
