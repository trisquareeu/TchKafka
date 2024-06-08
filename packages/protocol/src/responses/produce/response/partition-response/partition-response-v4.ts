import { Int16, Int32, Int64 } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';

export class PartitionResponseV4 {
  constructor(
    public readonly index: Int32,
    public readonly errorCode: Int16,
    public readonly baseOffset: Int64,
    public readonly logAppendTime: Int64
  ) {}

  public static deserialize(buffer: ReadBuffer): PartitionResponseV4 {
    return new PartitionResponseV4(
      Int32.deserialize(buffer),
      Int16.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer)
    );
  }
}
