import { type Array, type String } from '../../../primitives';
import { type PartitionDataV5 } from './partition-data';
import { TopicDataV4, TopicDataV4Factory } from './topic-data-v4';

export class TopicDataV5 extends TopicDataV4 {
  constructor(name: String, partitionData: Array<PartitionDataV5>) {
    super(name, partitionData);
  }
}

export class TopicDataV5Factory extends TopicDataV4Factory {
  public override create(): TopicDataV5 {
    return super.create();
  }
}
