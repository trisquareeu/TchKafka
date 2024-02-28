import { CompactNullableString, Uuid } from '../../../primitives';
import { TopicListFactoryTemplate } from './topic-list-factory';
import { TopicV11 } from './topic-v11';

export class TopicV12 extends TopicV11 {}

export class TopicV12ListFactory extends TopicListFactoryTemplate<TopicV12> {
  public create(): TopicV12[] {
    return this.topics.map((topic) => {
      if ('id' in topic) {
        return new TopicV12(Uuid.from(topic.id), new CompactNullableString(topic.name ?? null));
      } else {
        if (!topic.name) {
          throw new Error('Missing name property in topics array');
        }

        return new TopicV12(Uuid.ZERO, new CompactNullableString(topic.name));
      }
    });
  }
}
