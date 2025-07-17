import { TopicV10, TopicV10Factory } from './topic-v10';

export class TopicV11 extends TopicV10 {}

export class TopicV11Factory extends TopicV10Factory {
  public override create(): TopicV11 {
    return super.create();
  }
}
