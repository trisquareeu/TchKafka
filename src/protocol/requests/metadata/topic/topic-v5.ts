import { TopicV4, TopicV4ListFactory } from './topic-v4';

export class TopicV5 extends TopicV4 {}

export class TopicV5ListFactory extends TopicV4ListFactory {
  public create(): TopicV5[] {
    return super.create();
  }
}
