import { type Partition } from './partition/';

export type TopicByName = {
  name: string;
  partitions: Partition[];
};
export type TopicById = {
  id: string;
  partitions: Partition[];
};
export type Topic = TopicByName | TopicById;

export abstract class TopicFactoryTemplate<T> {
  constructor(protected readonly topicData: Topic) {}

  protected isTopicByName(topicData: TopicByName | TopicById): topicData is TopicByName {
    return 'name' in topicData;
  }

  public abstract create(): T;
}
