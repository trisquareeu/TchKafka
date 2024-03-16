/* eslint-disable @typescript-eslint/no-array-constructor */
import { String, Array } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';
import { PartitionDataV3Factory, type PartitionDataV3 } from './partition-data';
import { TopicDataFactoryTemplate } from './topic-data-factory';

export class TopicDataV3 implements Serializable {
  constructor(
    public readonly name: String,
    public readonly partitionData: Array<PartitionDataV3>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.name.serialize(buffer);
    await this.partitionData.serialize(buffer);
  }
}

export class TopicDataV3Factory extends TopicDataFactoryTemplate<TopicDataV3> {
  public create(): TopicDataV3 {
    return new TopicDataV3(
      new String(this.topicData.name),
      new Array(
        this.topicData.partitionData.map((entry) => new PartitionDataV3Factory(entry).create()),
        (partitionData, buffer) => partitionData.serialize(buffer)
      )
    );
  }
}
