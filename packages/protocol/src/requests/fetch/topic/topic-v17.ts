import { TopicV16, TopicV16Factory } from './topic-v16';

export class TopicV17 extends TopicV16 {}

export class TopicV17Factory extends TopicV16Factory {
  public override create(): TopicV17 {
    return super.create();
  }
}
