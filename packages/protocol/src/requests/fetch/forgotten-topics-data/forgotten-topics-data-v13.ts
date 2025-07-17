import { TagSection } from '../../../commons';
import { CompactArray, Int32, Uuid } from '../../../primitives';
import { Serializable, WriteBuffer } from '../../../serialization';
import { ForgottenTopicsDataFactoryTemplate } from './forgotten-topics-data-factory';

export class ForgottenTopicsDataV13 implements Serializable {
  constructor(
    private readonly topic: Uuid,
    private readonly partitions: CompactArray<Int32>,
    private readonly tags = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topic.serialize(buffer);
    await this.partitions.serialize(buffer);
    await this.tags.serialize(buffer);
  }
}

export class ForgottenTopicsDataV13Factory extends ForgottenTopicsDataFactoryTemplate<ForgottenTopicsDataV13> {
  public create(): ForgottenTopicsDataV13 {
    if (this.isForgottenTopicsDataByName(this.forgottenTopicsData)) {
      throw new Error('Missing id property in forgotten topics data');
    }

    return new ForgottenTopicsDataV13(
      new Uuid(Buffer.from(this.forgottenTopicsData.id)),
      new CompactArray(this.forgottenTopicsData.partitions.map((partition) => new Int32(partition)))
    );
  }
}
