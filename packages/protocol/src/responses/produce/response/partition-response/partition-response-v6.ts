import { Int16, Int32, Int64 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionResponseV6 {
  constructor(
    public readonly index: Int32,
    public readonly errorCode: Int16,
    public readonly baseOffset: Int64,
    public readonly logAppendTime: Int64,
    public readonly logStartOffset: Int64
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<PartitionResponseV6> {
    return new PartitionResponseV6(
      await Int32.deserialize(buffer),
      await Int16.deserialize(buffer),
      await Int64.deserialize(buffer),
      await Int64.deserialize(buffer),
      await Int64.deserialize(buffer)
    );
  }
}
