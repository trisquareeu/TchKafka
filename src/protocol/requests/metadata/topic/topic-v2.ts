import { TopicV1, TopicV1ListFactory } from './topic-v1';

export class TopicV2 extends TopicV1 {}

export class TopicV2ListFactory extends TopicV1ListFactory {
  public create(): TopicV2[] {
    return super.create();
  }
}
