import { TopicV14, TopicV14Factory } from './topic-v14';

export class TopicV15 extends TopicV14 {}

export class TopicV15Factory extends TopicV14Factory {
  public override create(): TopicV15 {
    return super.create();
  }
}
