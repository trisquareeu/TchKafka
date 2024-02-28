import { type UUID } from 'crypto';

export type SimpleTopic = { name: string };
export type SpecificTopic = { id: UUID; name?: string };
export type TopicList = SimpleTopic[] | SpecificTopic[];

export abstract class TopicListFactoryTemplate<T> {
  constructor(protected readonly topics: TopicList) {}

  protected doesContainNames(topics: SpecificTopic[] | SimpleTopic[]): topics is Required<SpecificTopic>[] {
    return topics.every((topic) => topic.name !== undefined);
  }

  public abstract create(): T[];
}
