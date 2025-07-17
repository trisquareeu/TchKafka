import { TopicV6, TopicV6Factory } from './topic-v6';

export class TopicV7 extends TopicV6 {}

export class TopicV7Factory extends TopicV6Factory {
  public override create(): TopicV7 {
    return super.create();
  }
}
