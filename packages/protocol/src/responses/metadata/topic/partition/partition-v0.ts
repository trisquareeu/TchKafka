import { Int32, Int16, Array } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionV0 {
  constructor(
    public readonly errorCode: Int16,
    public readonly partitionIndex: Int32,
    public readonly leaderId: Int32,
    public readonly replicaNodes: Array<Int32>,
    public readonly isrNodes: Array<Int32>
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<PartitionV0> {
    return new PartitionV0(
      await Int16.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Int32.deserialize(buffer),
      await Array.deserialize(buffer, Int32.deserialize),
      await Array.deserialize(buffer, Int32.deserialize)
    );
  }
}
