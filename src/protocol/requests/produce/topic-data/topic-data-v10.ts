import { type CompactArray, type CompactString } from '../../../primitives';
import { type PartitionDataV10 } from './partition-data';
import { TopicDataV9, TopicDataV9Factory } from './topic-data-v9';

export class TopicDataV10 extends TopicDataV9 {
  constructor(name: CompactString, partitionData: CompactArray<PartitionDataV10>) {
    super(name, partitionData);
  }
}

export class TopicDataV10Factory extends TopicDataV9Factory {
  public create(): TopicDataV10 {
    return super.create();
  }
}
