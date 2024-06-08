import { String } from '../../../primitives';
import { TopicListFactoryTemplate } from './topic-list-factory';

export class TopicV0 extends String {}

export class TopicV0ListFactory extends TopicListFactoryTemplate<TopicV0> {
  public create(): TopicV0[] {
    if (this.doesContainNames(this.topics)) {
      return this.topics.map((topic) => new TopicV0(topic.name));
    }

    throw new Error('Missing name property in topics array');
  }
}
