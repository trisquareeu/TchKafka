import { Int16, Int32, Int64 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionResponseV7 {
  constructor(
    public readonly index: Int32,
    public readonly errorCode: Int16,
    public readonly baseOffset: Int64,
    public readonly logAppendTime: Int64,
    public readonly logStartOffset: Int64
  ) {}

  public static deserialize(buffer: ReadBuffer): PartitionResponseV7 {
    return new PartitionResponseV7(
      Int32.deserialize(buffer),
      Int16.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer)
    );
  }
}
