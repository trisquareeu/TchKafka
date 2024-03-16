import { Array, Int16, Int32, Int64, NullableString } from '../../../../primitives';
import { type ReadBuffer } from '../../../../serialization';
import { RecordErrorV8 } from './record-error';

export class PartitionResponseV8 {
  constructor(
    public readonly index: Int32,
    public readonly errorCode: Int16,
    public readonly baseOffset: Int64,
    public readonly logAppendTime: Int64,
    public readonly logStartOffset: Int64,
    public readonly recordErrors: Array<RecordErrorV8>,
    public readonly errorMessage: NullableString
  ) {}

  public static deserialize(buffer: ReadBuffer): PartitionResponseV8 {
    return new PartitionResponseV8(
      Int32.deserialize(buffer),
      Int16.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer),
      Int64.deserialize(buffer),
      Array.deserialize(buffer, RecordErrorV8.deserialize),
      NullableString.deserialize(buffer)
    );
  }
}
