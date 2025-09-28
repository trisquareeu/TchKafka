import { Array, Int16, Int32 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionV1 {
  constructor(
    public readonly errorCode: Int16,
    public readonly partitionIndex: Int32,
    public readonly leaderId: Int32,
    public readonly replicaNodes: Array<Int32>,
    public readonly isrNodes: Array<Int32>
  ) {}

  public static deserialize(buffer: ReadBuffer): PartitionV1 {
    return new PartitionV1(
      Int16.deserialize(buffer),
      Int32.deserialize(buffer),
      Int32.deserialize(buffer),
      Array.deserialize(buffer, Int32.deserialize),
      Array.deserialize(buffer, Int32.deserialize)
    );
  }
}
