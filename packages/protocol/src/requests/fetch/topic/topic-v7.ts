import { Array, String } from '../../../primitives';
import { type WriteBuffer, type Serializable } from '../../../serialization';
import { PartitionV7Factory, type PartitionV7 } from './partition/partition-v7';
import { TopicFactoryTemplate } from './topic-factory';

export class TopicV7 implements Serializable {
  constructor(
    private readonly topic: String,
    private readonly partitions: Array<PartitionV7>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topic.serialize(buffer);
    await this.partitions.serialize(buffer);
  }
}

export class TopicV7Factory extends TopicFactoryTemplate<TopicV7> {
  public create(): TopicV7 {
    return new TopicV7(
      new String(this.topicData.name),
      // eslint-disable-next-line @typescript-eslint/no-array-constructor
      new Array(
        this.topicData.partitions.map((entry) => new PartitionV7Factory(entry).create()),
        (partition, buffer) => partition.serialize(buffer)
      )
    );
  }
}
