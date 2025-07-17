import { TopicV7, TopicV7Factory } from './topic-v7';

export class TopicV8 extends TopicV7 {}

export class TopicV8Factory extends TopicV7Factory {
  public override create(): TopicV8 {
    return super.create();
  }
}
