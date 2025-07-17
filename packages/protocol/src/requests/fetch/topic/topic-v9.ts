import { TopicV8, TopicV8Factory } from './topic-v8';

export class TopicV9 extends TopicV8 {}

export class TopicV9Factory extends TopicV8Factory {
  public override create(): TopicV9 {
    return super.create();
  }
}
