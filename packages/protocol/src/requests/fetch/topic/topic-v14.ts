import { TopicV13, TopicV13Factory } from './topic-v13';

export class TopicV14 extends TopicV13 {}

export class TopicV14Factory extends TopicV13Factory {
  public override create(): TopicV14 {
    return super.create();
  }
}
