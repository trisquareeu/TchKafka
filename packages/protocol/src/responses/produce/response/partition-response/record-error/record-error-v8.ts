import { Int32, NullableString } from '../../../../../primitives';
import { type ReadBuffer } from '../../../../../serialization';

export class RecordErrorV8 {
  constructor(
    public readonly batchIndex: Int32,
    public readonly batchIndexErrorMessage: NullableString
  ) {}

  public static async deserialize(buffer: ReadBuffer): Promise<RecordErrorV8> {
    return new RecordErrorV8(await Int32.deserialize(buffer), await NullableString.deserialize(buffer));
  }
}
