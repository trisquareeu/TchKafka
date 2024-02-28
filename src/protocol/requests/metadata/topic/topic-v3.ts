import { TopicV2, TopicV2ListFactory } from './topic-v2';

export class TopicV3 extends TopicV2 {}

export class TopicV3ListFactory extends TopicV2ListFactory {
  public create(): TopicV3[] {
    return super.create();
  }
}
