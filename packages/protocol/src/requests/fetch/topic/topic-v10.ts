import { TopicV9, TopicV9Factory } from './topic-v9';

export class TopicV10 extends TopicV9 {}

export class TopicV10Factory extends TopicV9Factory {
  public override create(): TopicV10 {
    return super.create();
  }
}
