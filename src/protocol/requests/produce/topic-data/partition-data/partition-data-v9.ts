import { TagSection } from '../../../../commons';
import { type Int32, type RecordBatch, UVarInt } from '../../../../primitives';
import { type Serializable, WriteBuffer } from '../../../../serialization';
import { PartitionDataFactoryTemplate } from './partition-data-factory';
import { PartitionDataV8Factory } from './partition-data-v8';

export class PartitionDataV9 implements Serializable {
  constructor(
    public readonly index: Int32,
    public readonly records: RecordBatch,
    public readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.index.serialize(buffer);

    const recordsBuffer = new WriteBuffer();
    await this.records.serialize(recordsBuffer);
    await new UVarInt(recordsBuffer.getOffset() + 1).serialize(buffer);
    buffer.writeBuffer(recordsBuffer.toBuffer());

    await this.tags.serialize(buffer);
  }
}

export class PartitionDataV9Factory extends PartitionDataFactoryTemplate<PartitionDataV9> {
  public create(): PartitionDataV9 {
    const partitionV8 = new PartitionDataV8Factory(this.partitionData).create();

    return new PartitionDataV9(partitionV8.index, partitionV8.records);
  }
}
