import { TagSection } from '../../../commons';
import { CompactString } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';
import { TopicListFactoryTemplate } from './topic-list-factory';

export class TopicV9 implements Serializable {
  constructor(
    private readonly name: CompactString,
    private readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.name.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}

export class TopicV9ListFactory extends TopicListFactoryTemplate<TopicV9> {
  public create(): TopicV9[] {
    if (this.doesContainNames(this.topics)) {
      return this.topics.map((topic) => new TopicV9(new CompactString(topic.name)));
    }

    throw new Error('Missing name property in topics array');
  }
}
