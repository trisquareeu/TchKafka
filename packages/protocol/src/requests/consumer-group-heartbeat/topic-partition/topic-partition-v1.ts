import { type TagSection } from '../../../commons';
import { type CompactArray, type Int32, type Uuid } from '../../../primitives';
import { type WriteBuffer } from '../../../serialization';

export class TopicPartitionV1 {
  constructor(
    public readonly topicId: Uuid,
    public readonly partitions: CompactArray<Int32>,
    public readonly tags: TagSection
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topicId.serialize(buffer);
    await this.partitions.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}
