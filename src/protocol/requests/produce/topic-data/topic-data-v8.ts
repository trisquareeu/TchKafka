import { type Array, type String } from '../../../primitives';
import { type PartitionDataV8 } from './partition-data';
import { TopicDataV7, TopicDataV7Factory } from './topic-data-v7';

export class TopicDataV8 extends TopicDataV7 {
  constructor(name: String, partitionData: Array<PartitionDataV8>) {
    super(name, partitionData);
  }
}

export class TopicDataV8Factory extends TopicDataV7Factory {
  public create(): TopicDataV8 {
    return super.create();
  }
}
