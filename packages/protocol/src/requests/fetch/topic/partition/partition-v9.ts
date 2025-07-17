import { Int32, Int64 } from '../../../../primitives';
import { Serializable, WriteBuffer } from '../../../../serialization';
import { PartitionFactoryTemplate } from './partition-factory';

export class PartitionV9 implements Serializable {
  constructor(
    private readonly partition: Int32,
    private readonly currentLeaderEpoch: Int32,
    private readonly fetchOffset: Int64,
    private readonly logStartOffset: Int64,
    private readonly partitionMaxBytes: Int32
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.partition.serialize(buffer);
    await this.currentLeaderEpoch.serialize(buffer);
    await this.fetchOffset.serialize(buffer);
    await this.logStartOffset.serialize(buffer);
    await this.partitionMaxBytes.serialize(buffer);
  }
}

export class PartitionV9Factory extends PartitionFactoryTemplate<PartitionV9> {
  public create(): PartitionV9 {
    return new PartitionV9(
      new Int32(this.partition.partition),
      new Int32(this.partition.currentLeaderEpoch ?? -1), // FIXME: Ensure that the default value should be here
      new Int64(this.partition.fetchOffset),
      new Int64(this.partition.logStartOffset),
      new Int32(this.partition.partitionMaxBytes)
    );
  }
}
