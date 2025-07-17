import { TopicV15, TopicV15Factory } from './topic-v15';

export class TopicV16 extends TopicV15 {}

export class TopicV16Factory extends TopicV15Factory {
  public override create(): TopicV16 {
    return super.create();
  }
}
