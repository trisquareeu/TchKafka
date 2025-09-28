import { TopicV6, TopicV6ListFactory } from './topic-v6';

export class TopicV7 extends TopicV6 {}

export class TopicV7ListFactory extends TopicV6ListFactory {
  public override create(): TopicV7[] {
    return super.create();
  }
}
