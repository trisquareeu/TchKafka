import { CompactArray, CompactString, Int32 } from '../../../primitives';
import { Serializable, WriteBuffer } from '../../../serialization';
import { ForgottenTopicsDataFactoryTemplate } from './forgotten-topics-data-factory';

export class ForgottenTopicsDataV12 implements Serializable {
  constructor(
    private readonly topic: CompactString,
    private readonly partitions: CompactArray<Int32>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topic.serialize(buffer);
    await this.partitions.serialize(buffer);
  }
}

export class ForgottenTopicsDataV12Factory extends ForgottenTopicsDataFactoryTemplate<ForgottenTopicsDataV12> {
  public create(): ForgottenTopicsDataV12 {
    if (this.isForgottenTopicsDataByName(this.forgottenTopicsData)) {
      return new ForgottenTopicsDataV12(
        new CompactString(this.forgottenTopicsData.topic),
        new CompactArray(this.forgottenTopicsData.partitions.map((partition) => new Int32(partition)))
      );
    }

    throw new Error('Missing topic property in forgotten topic data');
  }
}
