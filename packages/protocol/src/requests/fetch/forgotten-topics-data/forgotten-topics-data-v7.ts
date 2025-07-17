import { Array, Int32, String } from '../../../primitives';
import { Serializable, WriteBuffer } from '../../../serialization';
import { ForgottenTopicsDataFactoryTemplate } from './forgotten-topics-data-factory';

export class ForgottenTopicsDataV7 implements Serializable {
  constructor(
    private readonly topic: String,
    private readonly partitions: Array<Int32>
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.topic.serialize(buffer);
    await this.partitions.serialize(buffer);
  }
}

export class ForgottenTopicsDataV7Factory extends ForgottenTopicsDataFactoryTemplate<ForgottenTopicsDataV7> {
  public create(): ForgottenTopicsDataV7 {
    if (this.isForgottenTopicsDataByName(this.forgottenTopicsData)) {
      return new ForgottenTopicsDataV7(
        new String(this.forgottenTopicsData.topic),
        new Array(this.forgottenTopicsData.partitions.map((partition) => new Int32(partition)))
      );
    }

    throw new Error('Missing topic property in forgotten topic data');
  }
}
