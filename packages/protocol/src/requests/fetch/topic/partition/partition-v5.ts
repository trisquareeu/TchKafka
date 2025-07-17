import { Int32, Int64 } from '../../../../primitives';
import { type Serializable, type WriteBuffer } from '../../../../serialization';
import { PartitionFactoryTemplate } from './partition-factory';

export class PartitionV5 implements Serializable {
  constructor(
    private readonly partition: Int32,
    private readonly fetchOffset: Int64,
    private readonly logStartOffset: Int64,
    private readonly partitionMaxBytes: Int32
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.partition.serialize(buffer);
    await this.fetchOffset.serialize(buffer);
    await this.logStartOffset.serialize(buffer);
    await this.partitionMaxBytes.serialize(buffer);
  }
}

export class PartitionV5Factory extends PartitionFactoryTemplate<PartitionV5> {
  public create(): PartitionV5 {
    return new PartitionV5(
      new Int32(this.partition.partition),
      new Int64(this.partition.fetchOffset),
      new Int64(this.partition.logStartOffset),
      new Int32(this.partition.partitionMaxBytes)
    );
  }
}
