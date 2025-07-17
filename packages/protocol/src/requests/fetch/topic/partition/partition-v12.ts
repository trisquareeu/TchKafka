import { TagSection } from '../../../../commons';
import { Int32, Int64 } from '../../../../primitives';
import { Serializable, WriteBuffer } from '../../../../serialization';
import { PartitionFactoryTemplate } from './partition-factory';

export class PartitionV12 implements Serializable {
  constructor(
    private readonly partition: Int32,
    private readonly currentLeaderEpoch: Int32,
    private readonly fetchOffset: Int64,
    private readonly lastFetchedEpoch: Int32,
    private readonly logStartOffset: Int64,
    private readonly partitionMaxBytes: Int32,
    public readonly tags: TagSection = new TagSection()
  ) {}

  public async serialize(buffer: WriteBuffer): Promise<void> {
    await this.partition.serialize(buffer);
    await this.currentLeaderEpoch.serialize(buffer);
    await this.fetchOffset.serialize(buffer);
    await this.lastFetchedEpoch.serialize(buffer);
    await this.logStartOffset.serialize(buffer);
    await this.partitionMaxBytes.serialize(buffer);
  }
}

export class PartitionV12Factory extends PartitionFactoryTemplate<PartitionV12> {
  public create(): PartitionV12 {
    return new PartitionV12(
      new Int32(this.partition.partition),
      new Int32(this.partition.currentLeaderEpoch ?? -1), // FIXME: Ensure that the default value should be here
      new Int64(this.partition.fetchOffset),
      new Int32(this.partition.lastFetchedEpoch ?? -1), // FIXME: Ensure that the default value should be here
      new Int64(this.partition.logStartOffset),
      new Int32(this.partition.partitionMaxBytes)
    );
  }
}
