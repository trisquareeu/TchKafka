import { TagSection } from '../../../commons';
import { type CompactString } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';

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
