import { TagSection } from '../../../commons';
import { type CompactNullableString, type Uuid } from '../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../serialization';

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
