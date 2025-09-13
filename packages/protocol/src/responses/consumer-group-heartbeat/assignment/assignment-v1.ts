import { type ReadBuffer } from '../../../serialization';
import { TagSection } from '../../../commons';
import { CompactArray } from '../../../primitives';
import { TopicPartitionV1 } from './topic-partition';

export class AssignmentV1 {
  constructor(
    public readonly topicPartitions: CompactArray<TopicPartitionV1>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): AssignmentV1 {
    const topicPartitions = CompactArray.deserialize(buffer, TopicPartitionV1.deserialize);
    const tags = TagSection.deserialize(buffer);

    return new AssignmentV1(topicPartitions, tags);
  }
}
