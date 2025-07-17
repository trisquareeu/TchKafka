import { TopicV5, TopicV5Factory } from './topic-v5';

export class TopicV6 extends TopicV5 {}

export class TopicV6Factory extends TopicV5Factory {
  public override create(): TopicV6 {
    return super.create();
  }
}
