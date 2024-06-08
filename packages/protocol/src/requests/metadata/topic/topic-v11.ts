import { TopicV10, TopicV10ListFactory } from './topic-v10';

export class TopicV11 extends TopicV10 {}

export class TopicV11ListFactory extends TopicV10ListFactory {
  public override create(): TopicV11[] {
    return super.create();
  }
}
