import { type Partition } from './partition/';

export type Topic = {
  name: string;
  partitions: Partition[];
};

export abstract class TopicFactoryTemplate<T> {
  constructor(protected readonly topicData: Topic) {}

  public abstract create(): T;
}
