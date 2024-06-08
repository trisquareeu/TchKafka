import { TagSection } from '../../../commons';
import { Uuid, CompactNullableString } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';
import { TopicListFactoryTemplate } from './topic-list-factory';

export class TopicV10 implements Serializable {
  constructor(
    private readonly id: Uuid,
    private readonly name: CompactNullableString,
    private readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.id.serialize(buffer);
    await this.name.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}

export class TopicV10ListFactory extends TopicListFactoryTemplate<TopicV10> {
  public create(): TopicV10[] {
    if (this.doesContainNames(this.topics)) {
      return this.topics.map((topic) => new TopicV10(Uuid.ZERO, new CompactNullableString(topic.name)));
    }

    throw new Error('Missing name property in topics array');
  }
}
