import { type Array, type String } from '../../../primitives';
import { type PartitionDataV6 } from './partition-data';
import { TopicDataV5, TopicDataV5Factory } from './topic-data-v5';

export class TopicDataV6 extends TopicDataV5 {
  constructor(name: String, partitionData: Array<PartitionDataV6>) {
    super(name, partitionData);
  }
}

export class TopicDataV6Factory extends TopicDataV5Factory {
  public override create(): TopicDataV6 {
    return super.create();
  }
}
