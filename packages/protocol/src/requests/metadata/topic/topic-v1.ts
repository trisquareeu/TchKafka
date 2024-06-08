import { TopicV0, TopicV0ListFactory } from './topic-v0';

export class TopicV1 extends TopicV0 {}

export class TopicV1ListFactory extends TopicV0ListFactory {
  public override create(): TopicV1[] {
    return super.create();
  }
}
