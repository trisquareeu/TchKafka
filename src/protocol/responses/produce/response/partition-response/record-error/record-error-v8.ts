import { Int32, NullableString } from '../../../../../primitives';
import { type ReadBuffer } from '../../../../../serialization';

export class RecordErrorV8 {
  constructor(
    public readonly batchIndex: Int32,
    public readonly batchIndexErrorMessage: NullableString
  ) {}

  public static deserialize(buffer: ReadBuffer): RecordErrorV8 {
    return new RecordErrorV8(Int32.deserialize(buffer), NullableString.deserialize(buffer));
  }
}
