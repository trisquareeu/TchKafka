import { TagSection } from '../../../commons';
import { CompactArray, CompactString } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';
import { PartitionV12Factory, type PartitionV12 } from './partition/partition-v12';
import { TopicFactoryTemplate } from './topic-factory';

export class TopicV12 implements Serializable {
  constructor(
    private readonly topic: CompactString,
    private readonly partitions: CompactArray<PartitionV12>,
    private readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topic.serialize(buffer);
    await this.partitions.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}

export class TopicV12Factory extends TopicFactoryTemplate<TopicV12> {
  public create(): TopicV12 {
    if (this.isTopicByName(this.topicData)) {
      return new TopicV12(
        new CompactString(this.topicData.name),
        // eslint-disable-next-line @typescript-eslint/no-array-constructor
        new CompactArray(
          this.topicData.partitions.map((entry) => new PartitionV12Factory(entry).create()),
          (partition, buffer) => partition.serialize(buffer)
        )
      );
    }

    throw new Error('Missing name property in topic data');
  }
}
