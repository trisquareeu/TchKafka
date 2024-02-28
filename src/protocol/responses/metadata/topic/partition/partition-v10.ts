import { TagSection } from '../../../../commons';
import { CompactArray, Int16, Int32 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionV10 {
  constructor(
    public readonly errorCode: Int16,
    public readonly partitionIndex: Int32,
    public readonly leaderId: Int32,
    public readonly leaderEpoch: Int32,
    public readonly replicaNodes: CompactArray<Int32>,
    public readonly isrNodes: CompactArray<Int32>,
    public readonly offlineReplicas: CompactArray<Int32>,
    public readonly tags: TagSection
  ) {}

  public static deserialize(buffer: ReadBuffer): PartitionV10 {
    return new PartitionV10(
      Int16.deserialize(buffer),
      Int32.deserialize(buffer),
      Int32.deserialize(buffer),
      Int32.deserialize(buffer),
      CompactArray.deserialize(buffer, Int32.deserialize),
      CompactArray.deserialize(buffer, Int32.deserialize),
      CompactArray.deserialize(buffer, Int32.deserialize),
      TagSection.deserialize(buffer)
    );
  }
}
