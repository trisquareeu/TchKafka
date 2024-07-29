import { Array, Int16, Int32 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionV2 {
  constructor(
    public readonly errorCode: Int16,
    public readonly partitionIndex: Int32,
    public readonly leaderId: Int32,
    public readonly replicaNodes: Array<Int32>,
    public readonly isrNodes: Array<Int32>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<PartitionV2> {
    return new PartitionV2(
      await Int16.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, Int32.deserialize),
      await Array.deserialize(buffer, Int32.deserialize)
    );
  }
}
