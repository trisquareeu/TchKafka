import { TagSection } from '../../../commons';
import { CompactArray, CompactString } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';
import { PartitionDataV9Factory, type PartitionDataV9 } from './partition-data';
import { TopicDataFactoryTemplate } from './topic-data-factory';

export class TopicDataV9 implements Serializable {
  constructor(
    public readonly name: CompactString,
    public readonly partitionData: CompactArray<PartitionDataV9>,
    public readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.name.serialize(buffer);
    await this.partitionData.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}

export class TopicDataV9Factory extends TopicDataFactoryTemplate<TopicDataV9> {
  public create(): TopicDataV9 {
    return new TopicDataV9(
      new CompactString(this.topicData.name),
      new CompactArray(
        this.topicData.partitionData.map((entry) => new PartitionDataV9Factory(entry).create()),
        (partitionData, buffer) => partitionData.serialize(buffer)
      )
    );
  }
}
