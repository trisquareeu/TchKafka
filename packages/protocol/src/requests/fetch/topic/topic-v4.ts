import { Array, String } from '../../../primitives';
import { type WriteBuffer, type Serializable } from '../../../serialization';
import { PartitionV4Factory, type PartitionV4 } from './partition';
import { TopicFactoryTemplate } from './topic-factory';

export class TopicV4 implements Serializable {
  constructor(
    private readonly topic: String,
    private readonly partitions: Array<PartitionV4>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topic.serialize(buffer);
    await this.partitions.serialize(buffer);
  }
}

export class TopicV4Factory extends TopicFactoryTemplate<TopicV4> {
  public create(): TopicV4 {
    if (this.isTopicByName(this.topicData)) {
      return new TopicV4(
        new String(this.topicData.name),
        // eslint-disable-next-line @typescript-eslint/no-array-constructor
        new Array(
          this.topicData.partitions.map((entry) => new PartitionV4Factory(entry).create()),
          (partition, buffer) => partition.serialize(buffer)
        )
      );
    }

    throw new Error('Missing name property in topic data');
  }
}
