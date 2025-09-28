import { type Array, type String } from '../../../primitives';
import { type PartitionDataV7 } from './partition-data';
import { TopicDataV6, TopicDataV6Factory } from './topic-data-v6';

export class TopicDataV7 extends TopicDataV6 {
  constructor(name: String, partitionData: Array<PartitionDataV7>) {
    super(name, partitionData);
  }
}

export class TopicDataV7Factory extends TopicDataV6Factory {
  public override create(): TopicDataV7 {
    return super.create();
  }
}
