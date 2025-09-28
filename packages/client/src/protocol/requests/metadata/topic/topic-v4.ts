import { TopicV3, TopicV3ListFactory } from './topic-v3';

export class TopicV4 extends TopicV3 {}

export class TopicV4ListFactory extends TopicV3ListFactory {
  public override create(): TopicV4[] {
    return super.create();
  }
}
