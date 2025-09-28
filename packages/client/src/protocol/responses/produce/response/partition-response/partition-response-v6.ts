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

  public static deserialize(buffer: ReadBuffer): PartitionResponseV6 {
    return new PartitionResponseV6(
      Int32.deserialize(buffer),
      Int16.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer)
    );
  }
}
