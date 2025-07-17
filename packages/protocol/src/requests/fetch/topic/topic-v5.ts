import { TopicV4, TopicV4Factory } from './topic-v4';

export class TopicV5 extends TopicV4 {}

export class TopicV5Factory extends TopicV4Factory {
  public override create(): TopicV5 {
    return super.create();
  }
}
