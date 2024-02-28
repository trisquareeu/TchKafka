import { TopicV5, TopicV5ListFactory } from './topic-v5';

export class TopicV6 extends TopicV5 {}

export class TopicV6ListFactory extends TopicV5ListFactory {
  public create(): TopicV6[] {
    return super.create();
  }
}
