import { type PartitionData } from './partition-data';

export type TopicData = {
  name: string;
  partitionData: PartitionData[];
};

export abstract class TopicDataFactoryTemplate<T> {
  constructor(protected readonly topicData: TopicData) {}

  public abstract create(): T;
}
