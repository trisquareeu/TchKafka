import { type Array, type String } from '../../../primitives';
import { type PartitionDataV4 } from './partition-data';
import { TopicDataV3, TopicDataV3Factory } from './topic-data-v3';

export class TopicDataV4 extends TopicDataV3 {
  constructor(name: String, partitionData: Array<PartitionDataV4>) {
    super(name, partitionData);
  }
}

export class TopicDataV4Factory extends TopicDataV3Factory {
  public override create(): TopicDataV4 {
    return super.create();
  }
}
