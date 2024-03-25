import { TopicV7, TopicV7ListFactory } from './topic-v7';

export class TopicV8 extends TopicV7 {}

export class TopicV8ListFactory extends TopicV7ListFactory {
  public create(): TopicV8[] {
    return super.create();
  }
}
