import { TagSection } from '../../../commons';
import { CompactArray, Uuid } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';
import { PartitionV13Factory, type PartitionV13 } from './partition/partition-v13';
import { TopicFactoryTemplate } from './topic-factory';

export class TopicV13 implements Serializable {
  constructor(
    private readonly topicId: Uuid,
    private readonly partitions: CompactArray<PartitionV13>,
    private readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topicId.serialize(buffer);
    await this.partitions.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}

export class TopicV13Factory extends TopicFactoryTemplate<TopicV13> {
  public create(): TopicV13 {
    if (this.isTopicByName(this.topicData)) {
      return new TopicV13(
        new Uuid(Buffer.from(this.topicData.name)),
        // eslint-disable-next-line @typescript-eslint/no-array-constructor
        new CompactArray(
          this.topicData.partitions.map((entry) => new PartitionV13Factory(entry).create()),
          (partition, buffer) => partition.serialize(buffer)
        )
      );
    }

    throw new Error('Missing ');
  }
}
